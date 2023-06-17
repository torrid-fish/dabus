import requests
from pprint import pprint
import json
import copy, time
from datetime import datetime

app_id = 'koios1143-d2c91cc5-2c58-4a06'
app_key = 'b222cb12-0d88-478c-9f47-5c47d120f53b'

auth_url="https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token"
base_url = "https://tdx.transportdata.tw/api/basic/v2/Bus/{}"

class Auth():

    def __init__(self, app_id, app_key):
        self.app_id = app_id
        self.app_key = app_key

    def get_auth_header(self):
        content_type = 'application/x-www-form-urlencoded'
        grant_type = 'client_credentials'

        return{
            'content-type' : content_type,
            'grant_type' : grant_type,
            'client_id' : self.app_id,
            'client_secret' : self.app_key
        }

class data():

    def __init__(self, app_id, app_key, auth_response):
        self.app_id = app_id
        self.app_key = app_key
        self.auth_response = auth_response

    def get_data_header(self):
        auth_JSON = json.loads(self.auth_response.text)
        access_token = auth_JSON.get('access_token')
        return{
            'authorization': 'Bearer '+access_token
        }

def SendRequest(request_url):
    """
    Send request to Bus API server with specific request_url
    request_url -- (str) The request link

    return a json object of return result
    """
    auth = Auth(app_id, app_key)
    auth_response = requests.post(auth_url, auth.get_auth_header())
    d = data(app_id, app_key, auth_response)
    data_response = requests.get(request_url, headers=d.get_data_header())
    return json.loads(data_response.text)

def GetBusScheduleNow(bus_name, direction):
    """
    Get specific bus's schedule according current time
    bus_name   -- (str) The bus's name (SubRouteName)
    direction  -- (int) The direction of the bus (0:'去程',1:'返程',2:'迴圈',255:'未知')
    
    return a list of timetable
    """

    current = datetime.strptime('{}:{}'.format(datetime.now().hour, datetime.now().minute) ,'%H:%M')
    name = '{}_{}'.format(bus_name, direction)
    schedule = json.loads(open('Schedule.json', 'r', encoding="utf-8").read())
    if(name not in schedule):
        return []
    
    for trip in schedule[name]:
        weekday = (datetime.today().weekday() + 1) % 7
        if(trip['ServiceDay'][weekday] == 0):
            continue
        start = datetime.strptime(trip['StopTimes'][0]['ArrivalTime'], '%H:%M')
        delta = (start - current).total_seconds()
        if(delta < 0):
            continue
        return trip['StopTimes']
    return []

def GetBusArrivalTime(bus_name, bus_type, direction, last_stop_sequence):
    """
    Get arrival time of specific bus's specific stop

    bus_name            -- (str) Name of the bus (SubRouteName)
    bus_type            -- (int) City / County / InterCity Bus (0 / 1 / 2)
    direction           -- (int) Direction of the bus (0:'去程',1:'返程',2:'迴圈',255:'未知')
    last_stop_sequence  -- (int) Last sequence number of the query stop

    return an integer list represent remaining seconds
    for each integer, if the last bus has been gone or there's no bus today, return -1
                      if the stop is temporary closed, return -2
    """

    current_time = datetime.now()
    result = ''
    args = '?format=JSON'
    if(bus_type == 0):
        city = 'Hsinchu'
        api_type = 'EstimatedTimeOfArrival/Streaming/City/{}/{}{}'.format(city, bus_name, args)
        request_url = base_url.format(api_type)
        result = SendRequest(request_url)
    elif(bus_type == 1):
        city = 'HsinchuCounty'
        api_type = 'EstimatedTimeOfArrival/Streaming/City/{}/{}{}'.format(city, bus_name, args)
        request_url = base_url.format(api_type)
        result = SendRequest(request_url)
    else:
        request_url = 'https://tdx.transportdata.tw/api/basic/v2/Bus/EstimatedTimeOfArrival/Streaming/InterCity/{}'.format(bus_name)
        result = SendRequest(request_url)

    # Check instant status
    estimate_times = []
    time_table = GetBusScheduleNow(bus_name, direction)
    for cur in range(1, last_stop_sequence + 1):
        placed = False
        for stop in result:
            if(placed):
                break
            if(stop['SubRouteName']['Zh_tw'] != bus_name or stop['Direction'] != direction or stop['StopSequence'] != cur):
                continue
            else:
                if(stop['StopStatus'] == 3 or stop['StopStatus'] == 4):
                    estimate_times.append(-1)
                    placed = True
                elif(stop['StopStatus'] == 2):
                    estimate_times.append(-2)
                    placed = True
                elif(stop['StopStatus'] == 1):
                    if(time_table == []):
                        estimate_times.append(-1)
                        placed = True
                    else:
                        for stop2 in time_table:
                            if(stop2['StopSequence'] != cur):
                                continue
                            else:
                                current_time2 = datetime.strptime('{}:{}'.format(datetime.now().hour, datetime.now().minute) ,'%H:%M')
                                arrival_time = datetime.strptime(stop2['ArrivalTime'], '%H:%M')
                                delta = int((arrival_time - current_time2).total_seconds())
                                estimate_times.append(delta)
                                placed = True
                else:
                    src_trans_time = datetime.fromisoformat(stop['SrcTransTime']).replace(tzinfo=None)
                    trans_time_delta = int((current_time - src_trans_time).total_seconds())
                    estimate_time = (int(stop['EstimateTime']) - trans_time_delta)
                    if(estimate_time < 0):
                        estimate_time = 0
                    estimate_times.append(estimate_time)
                    placed = True

    return estimate_times


def GetRouteArrival(route_name, direction):
    city = 'Hsinchu'
    args = '?format=JSON'
    api_type = 'EstimatedTimeOfArrival/Streaming/City/{}/{}{}'.format(city, route_name, args)
    request_url = base_url.format(api_type)

    request_result = SendRequest(request_url)
    current_time = datetime.now()
    return_result = json.loads("[]")
    element_template = json.loads('{"name": "", "arrivalTime": -1}')

    with open('temp.json', 'w') as f:
        f.write(json.dumps(request_result, ensure_ascii=False))

    for index in range(len(request_result)):
        if(request_result[index]['PlateNumb'] == '-1' or
           request_result[index]['Direction'] != direction or
           'EstimateTime' not in request_result[index]):
           continue

        src_trans_time = datetime.fromisoformat(request_result[index]['SrcTransTime']).replace(tzinfo=None)
        trans_time_delta = int((current_time - src_trans_time).total_seconds())
        estimate_time = int((int(request_result[index]['EstimateTime']) - trans_time_delta) / 60)

        template = copy.deepcopy(element_template)
        template['name'] = request_result[index]['StopName']['Zh_tw']
        template['arrivalTime'] = estimate_time
        return_result.append(template)

    return return_result

if __name__ == '__main__':
    bus_name = '182'
    # bus_name, bus_type, direction, stop_sequence
    print([ int(x / 60) for x in GetBusArrivalTime(bus_name, 0, 0, 10)])
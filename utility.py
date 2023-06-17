import requests
import json
import copy, time
from datetime import datetime

app_id = 'koios1143-d2c91cc5-2c58-4a06'
app_key = 'b222cb12-0d88-478c-9f47-5c47d120f53b'

auth_url="https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token"
base_url = "https://tdx.transportdata.tw/api/basic/v2/Bus/{}"

schedule = json.loads(open('Schedule.json', 'r', encoding="utf-8").read())
routes_len = {}
stop_code = {}

with open('RouteStop.json', 'r', encoding="utf-8") as f:
    routes_data = json.loads(f.read())
    for key in routes_data:
        routes_len[key] = len(routes_data[key])
        stop_code[key] = {}
        for stop in routes_data[key]:
            stop_code[key][stop['StopName']] = stop['StopSequence']

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


def GetTime(bus_name, start_stop, direction, bus_type):
    arrival_list = GetBusArrivalTime(bus_name, bus_type, direction)
    name = '{}_{}'.format(bus_name, direction)
    stop_sequence = stop_code[name][start_stop]
    return arrival_list[stop_sequence]

def GetBusArrivalTime(bus_name, bus_type, direction):
    """
    Get arrival time of specific bus's specific stop

    bus_name            -- (str) Name of the bus (SubRouteName)
    bus_type            -- (int) City / County / InterCity Bus (0 / 1 / 2)
    direction           -- (int) Direction of the bus (0:'去程',1:'返程',2:'迴圈',255:'未知')

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

    with open('why.json', 'w') as f:
        f.write(json.dumps(result, ensure_ascii=False))

    for cur in range(1, routes_len['{}_{}'.format(bus_name, direction)] + 1):
        for stop in result:
            if(stop['SubRouteName']['Zh_tw'] != bus_name or stop['Direction'] != direction or stop['StopSequence'] != cur):
                continue
            else:
                if(stop['StopStatus'] == 3 or stop['StopStatus'] == 4):
                    estimate_times.append(-1)
                    break
                elif(stop['StopStatus'] == 2):
                    estimate_times.append(-2)
                    break
                elif(stop['StopStatus'] == 1):
                    if(time_table == []):
                        estimate_times.append(-1)
                        break
                    else:
                        break
                elif(stop['StopStatus'] == 0):
                    src_trans_time = datetime.fromisoformat(stop['SrcTransTime']).replace(tzinfo=None)
                    trans_time_delta = int((current_time - src_trans_time).total_seconds())
                    estimate_time = (int(stop['EstimateTime']) - trans_time_delta)
                    if(estimate_time < 0):
                        estimate_time = 0
                    estimate_times.append(estimate_time)
                    break
        try:
            estimate_times[cur - 1]
        except:
            for stop2 in time_table:
                if(stop2['StopSequence'] != cur):
                    continue
                else:
                    current_time2 = datetime.strptime('{}:{}'.format(datetime.now().hour, datetime.now().minute) ,'%H:%M')
                    arrival_time = datetime.strptime(stop2['ArrivalTime'], '%H:%M')
                    delta = int((arrival_time - current_time2).total_seconds())
                    estimate_times.append(delta)

    return estimate_times

def GetWalkingTime(start_lat, start_lon, end_lat, end_lon):
    """
    Get walking time from start to end by google api

    start_lat -- (double) latitude of start point
    start_lon -- (double) longitude of start point
    end_lat   -- (double) latitude of end point
    end_lon   -- (double) longitude of end point

    Return an integer represent the time to travel from start to end in seconds.
    Note that this api only return value that greater or equal to 1 minute
    If there's any error, then it'll return -1
    """
    google_api_key = 'AIzaSyAxFtQQD7u-IlVGquIA9HLBEcJadijtkD8'
    request_url = 'https://maps.googleapis.com/maps/api/distancematrix/json?origins={},{}&destinations={},{}&mode=walking&key={}'.format(start_lat, start_lon, end_lat, end_lon, google_api_key)
    result = json.loads(requests.request("GET", request_url, headers={}, data={}).text)
    try:
        return int(result['rows'][0]['elements'][0]['duration']['text'].split(' ')[0]) * 60
    except:
        return -1

if __name__ == '__main__':
    bus_name = '182'
    # bus_name, bus_type, direction, stop_sequence
    print(GetBusArrivalTime(bus_name, 0, 0))
    # print(GetWalkingTime(24.801818, 120.971263, 24.798355, 120.994509))
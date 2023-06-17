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
        print(self.auth_response.text)
        return{
            'authorization': 'Bearer '+access_token
        }

# Send request to Bus API server with specific request_url
def SendRequest(request_url):
    auth = Auth(app_id, app_key)
    auth_response = requests.post(auth_url, auth.get_auth_header())
    d = data(app_id, app_key, auth_response)
    data_response = requests.get(request_url, headers=d.get_data_header())
    return json.loads(data_response.text)

def GetInterSchedule(route_name):
    args = '?format=JSON'
    request_url = 'https://tdx.transportdata.tw/api/basic/v2/Bus/Schedule/InterCity/{}{}'.format(route_name, args)
    return SendRequest(request_url)

def GetBusSchedule(route_name):
    city = 'HsinchuCounty'
    args = '?format=JSON'
    api_type = 'Schedule/City/{}/{}{}'.format(city, route_name, args)
    request_url = base_url.format(api_type)

    return SendRequest(request_url)

def DayOneHot(data):
    res = ''
    for i in data:
        res += str(data[i])
    return res

all_result = json.loads('{}')
def PackData(result):
    for direction in result:
        name = '{}_{}'.format(direction['SubRouteName']['Zh_tw'], direction['Direction'])
        print('\t{}'.format(name))
        all_result[name] = []
        for i in range(1, len(direction['Timetables'])+1):
            for j in direction['Timetables']:
                if(j['TripID'] != str(i)):
                    continue
                data = json.loads('{}')
                data['TripSequence'] = i
                data['ServiceDay'] = DayOneHot(j['ServiceDay'])
                data['StopTimes'] = []
                for k in range(1, len(j['StopTimes'])+1):
                    for l in copy.deepcopy(j['StopTimes']):
                        if(l['StopSequence'] != k):
                            continue
                        stop = json.loads('{}')
                        stop['StopSequence'] = k
                        stop['StopName'] = l['StopName']['Zh_tw']
                        stop['ArrivalTime'] = l['ArrivalTime']
                        data['StopTimes'].append(copy.deepcopy(stop))
                all_result[name].append(copy.deepcopy(data))
                
                with open('CountySchedule.json', 'w') as f:
                    f.write(json.dumps(all_result, ensure_ascii=False))

if __name__ == '__main__':
    routes = json.loads(open('../RoutesListFiles/RouteNames.json', 'r').read())[1]['routes']
    for route in routes:
        print(route)
        PackData(GetBusSchedule(route))
        time.sleep(3)
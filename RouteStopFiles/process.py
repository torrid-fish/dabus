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

def GetRouteStops():
    city = 'HsinchuCounty'
    args = '?format=JSON'
    routes = json.loads(open('RoutesListFiles/RouteNames.json', 'r').read())

    # Store All data in dict format
    AllStops = json.loads('{}')

    for route_name in routes[1]['routes']:
        print(route_name)
        api_type = 'StopOfRoute/City/{}/{}{}'.format(city, route_name, args)
        request_url = base_url.format(api_type)
        result = SendRequest(request_url)

        for i in result:
            name = '{}_{}'.format(i['SubRouteName']['Zh_tw'], i['Direction'])
            AllStops[name] = []
            print('\t{}'.format(name))
            for k in i['Stops']:
                stop = json.loads('{}')
                j = copy.deepcopy(k)
                stop['StopName'] = j['StopName']['Zh_tw']
                stop['Lon'] = j['StopPosition']['PositionLon']
                stop['Lat'] = j['StopPosition']['PositionLat']
                #stop['BusType'] = 1
                #stop['RouteName'] = i['SubRouteName']['Zh_tw']
                #stop['Direction'] = i['Direction']
                stop['StopSequence'] = j['StopSequence']
                AllStops[name].append(copy.deepcopy(stop))
            
        #print(json.dumps(result, ensure_ascii=False))
        with open('CountyRouteStop.json', 'w') as f:
            f.write(json.dumps(AllStops, ensure_ascii=False))
        time.sleep(3)

def GetInterCityRouteStops():
    f = json.loads(open('All.json', 'r').read())
    AllStops = json.loads('{}')
    routes = json.loads(open('RoutesListFiles/RouteNames.json', 'r').read())[2]['routes']

    for route in f:
        if(route['SubRouteName']['Zh_tw'] not in routes):
            continue
        name = '{}_{}'.format(route['SubRouteName']['Zh_tw'], route['Direction'])
        print(name)
        AllStops[name] = []
        for i in route['Stops']:
            stop = json.loads('{}')
            j = copy.deepcopy(i)
            stop['StopName'] = j['StopName']['Zh_tw']
            stop['Lon'] = j['StopPosition']['PositionLon']
            stop['Lat'] = j['StopPosition']['PositionLat']
            #stop['BusType'] = 2
            #stop['RouteName'] = route['SubRouteName']['Zh_tw']
            #stop['Direction'] = route['Direction']
            stop['StopSequence'] = j['StopSequence']
            AllStops[name].append(copy.deepcopy(stop))
        with open('InterCityRouteStop.json', 'w') as f:
            f.write(json.dumps(AllStops, ensure_ascii=False))

if __name__ == '__main__':
    GetRouteStops()
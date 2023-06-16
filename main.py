import requests
from pprint import pprint
import json
import copy
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
    auth = Auth(app_id, app_key)
    auth_response = requests.post(auth_url, auth.get_auth_header())
    d = data(app_id, app_key, auth_response)
    data_response = requests.get(request_url, headers=d.get_data_header())
    return json.loads(data_response.text)

def GetRouteDetail(route_name):
    city = 'Hsinchu'
    args = '?format=JSON'
    api_type = 'StopOfRoute/City/{}/{}{}'.format(city, route_name, args)
    request_url = base_url.format(api_type)

    result = SendRequest(request_url)

    with open('routes_detail.json', 'w') as f:
        f.write(json.dumps(result))

def GetRouteArrival(route_name, direction):
    city = 'Hsinchu'
    args = '?format=JSON'
    api_type = 'EstimatedTimeOfArrival/Streaming/City/{}/{}{}'.format(city, route_name, args)
    request_url = base_url.format(api_type)

    request_result = SendRequest(request_url)
    current_time = datetime.now()
    return_result = json.loads("[]")
    element_template = json.loads('{"name": "", "arrivalTime": -1}')

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
    route_name = '182'
    result = GetRouteArrival(route_name, 0)
    print(json.dumps(result, ensure_ascii=False))
    #GetRouteDetail(route_name)
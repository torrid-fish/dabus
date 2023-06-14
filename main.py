import requests
from pprint import pprint
import json
import datetime

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

if __name__ == '__main__':
    city = 'Hsinchu'
    route_name = '182'
    args = '?format=JSON&orderby=EstimateTime'
    api_type = 'EstimatedTimeOfArrival/Streaming/City/{}/{}{}'.format(city, route_name, args)
    request_url = base_url.format(api_type)

    try:
        d = data(app_id, app_key, auth_response)
        data_response = requests.get(request_url, headers=d.get_data_header())
    except:
        a = Auth(app_id, app_key)
        auth_response = requests.post(auth_url, a.get_auth_header())
        d = data(app_id, app_key, auth_response)
        data_response = requests.get(request_url, headers=d.get_data_header())    
    #print(auth_response)
    #pprint(auth_response.text)
    with open('output.json', 'w') as f:
        f.write(data_response.text)
    
    

    #print(data_response)
    #pprint(data_response.text)


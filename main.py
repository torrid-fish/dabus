from flask import Flask, request
from routing import routing
from utility import GetTime, GetGeoLocation
import json, os
app = Flask(__name__)

@app.route('/search', methods=['GET'])
def search():
    args = request.args
    dest = args['dest'].split(',')
    depa = args['depa'].split(',')
    try:
        data = routing(float(depa[0]), float(depa[1]), float(dest[0]), float(dest[1]))
    except Exception as e:
        print(e)
        return json.dumps({
            "status": "bad"
        })

    return json.dumps({
        "status": "ok",
        "data": data
    }, ensure_ascii=False)    

@app.route('/notification', methods=['GET'])
def notification():
    args = request.args
    busName = args['busName']
    startStop = args['startStop']
    direction = args['direction']
    busType = args['busType']

    try:
        time = GetTime(busName, startStop, direction, busType)
    except:
        time = -1
    
    if(time > 0):
        return json.dumps({
            "status": "ok",
            "time": int(time / 60)
        }, ensure_ascii=False)
    else:
        return json.dumps({
            "status": "ok",
            "time": time
        }, ensure_ascii=False)

@app.route('/geoLocation', methods=['GET'])
def GeoLocation():
    args = request.args
    locationName = args['name']
    result = GetGeoLocation(locationName)
    if(result == (-1, -1)):
        return json.dumps({
            "status": "bad"
        })
    else:
        return json.dumps({
            "status": "ok",
            "data": {
                "lat": result[0],
                "lon": result[1]
            }
        })

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(host= '0.0.0.0', port= port, debug= True)
from flask import Flask, request, jsonify
from routing import routing
from utility import GetTime
import json
app = Flask(__name__)

@app.route('/search', methods=['GET'])
def search():
    args = request.args
    dest = args['dest'].split(',')
    depa = args['depa'].split(',')
    try:
        data = routing(float(depa[0]), float(depa[1]), float(dest[0]), float(dest[1]))
    except:
        return "API overflow:(" # Retry design is required

    return jsonify({
        "status": "ok",
        "data": data
    })    

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
    
    return jsonify({
        "status": "ok",
        "time": time
    })

if __name__ == '__main__':
    app.run(port='5000', debug=True)
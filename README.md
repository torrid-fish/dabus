# DaBus Backend

## Install
```bash
pip3 install -r requirement.txt
```

## Open Server
```
python3 main.py
```

## Usage
# Backend API 公車查詢

We only focus on designing the algorithm to figure out which bus stop to choose.

### <center>Search (GET)</center>
> query=search&dest=緯度,經度&depa=緯度,經度

```=
url.com/search?dest=24.785433,120.999092&depa=25.0123,124.231
```

    
### <center>Receive</center>
```json=
{
    "status": "ok", // ok, bad
    "data":[
        {
            "busName": "藍線一區",
            "departureStop": "馬偕",
            "destinationStop": "新竹火車站",
            "currentStop": "清華大學",
            "arriveTime": 5, // minutes
            "FromStopLat": 23.456,
            "FromStopLon": 123.756,
            // List out all stops of 藍線一區
            "stops": [
                {
                    "name": "文教新村",
                    "arriveTime": 30
                },
                ...
            ],
            "BusType": 0,
            "Direction": 0,
            "FromStopWalkTime": 100,
            "ToStopWalkTime": 150,
            "TravelTime": 300,
            "WaitTime": 560
        },
        {
            "busType": "182",
            "departureStop": "水源地",
            "destinationStop": "新竹火車站",
            "currentStop": "清華大學",
            "arriveTime": 10, // minutes
            // List out all stops of 182
            "stops": [
                {
                    "name": "新竹高鐵站",
                    "arriveTime": 30
                },
                ...
            ],
            "BusType": 0,
            "Direction": 0,
            "FromStopWalkTime": 100,
            "ToStopWalkTime": 150,
            "TravelTime": 300,
            "WaitTime": 560
        },
        ...
    ]
}
```

### <center>Sample Output</center>
```json=
{
    'RouteName': '藍線1區', 
    'BusType': 0, 
    'Direction': 0, 
    'FromStopName': '清華大學',
    'FromStopSequence': 43, 
    'ToStopName': '光復中學', 
    'ToStopSequence': 44, 
    'DistanceFrom': 2.7168425557133555,    
    'FromStopWalkTime': 2340, 
    'DistanceTo': 0.03345327385339943, 
    'ToStopWalkTime': 60, 
    'TravelTime': 60, 
    'WaitTime': 23
}
```

### <center>Notification (GET)</center>

```=
url.com/notification?busName="藍線1區"&busType=0&startStop="馬偕醫院"&direction=0
```

    
### <center>Receive</center>

- time: 若因末班車已過、今日無公車，回傳 -1。如果因交管不停靠，回傳 -2。否則回傳還有幾分鐘

```json=
{
    "status": "ok",
    "data":{
        "time": 10 // in minutes
    }
}
```
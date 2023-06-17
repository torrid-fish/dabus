import json
from math import radians, cos, sin, asin, sqrt
from main import GetBusArrivalTime

with open("./StopList.json", "r", encoding="utf-8") as f:
    StopList = json.loads(f.read())

with open("./RouteStop.json", "r", encoding="utf-8") as f:
    RouteStop = json.loads(f.read())

def distance(lat1: float, lon1: float, lat2: float, lon2: float):
    """
    Calculating the distance between to points on earth.
    """
    # Converts from degrees to radians.
    lon1 = radians(lon1)
    lon2 = radians(lon2)
    lat1 = radians(lat1)
    lat2 = radians(lat2)
      
    # Haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
 
    c = 2 * asin(sqrt(a))
    
    # Radius of earth in kilometers
    r = 6371
      
    # calculate the result
    return(c * r)

def find_near_stops(lat: float, lon: float, threshold: float):
    """
    Use `threshold`(unit: kilometer) to determine how far the acceptable distance is. \\
    That is, return the set of bus stops with distance smaller than val.
    """
    # First sort the stop list
    _StopList = sorted(StopList, key= lambda stop: distance(lat, lon, stop["Lat"], stop["Lon"]))

    # Find the threshold
    threshold_idx = len(_StopList)
    for i in range(len(_StopList)-1, -1, -1):
        if distance(lat, lon, _StopList[i]["Lat"], _StopList[i]["Lon"]) > threshold:
            threshold_idx = i
        else:
            break

    # Return the acceptable stops
    return _StopList[:threshold_idx]

def score(distance_from, distance_to, travel_time, waiting_time):
    """
    Score the route based on given parameters.
    """
    a, b, c, d = 1, 2, 3, 4
    return a * distance_from + b * distance_to + c * travel_time + d * waiting_time

def routing(from_lat: float, from_lon: float, to_lat: float, to_lon: float):
    """
    This function will use `(fromlat, fromlon)` and `(tolat, tolon)` to calculate the best bus to take.
    
    After the calculation, it will return a result of routing.

    ## Return
    A list of possible routes, each route is a dictionary that will have:

    - "RouteName": The name of the route.
    - "BusType": The type of the bus.
    - "Direction": The direction of the bus.
    - "FromStopName": The name of the bus stop that user gets on.
    - "FromStopSequence": The sequence number of the bus stop that user gets on.
    - "ToStopName": The name of the bus stop that user gets off.
    - "ToStopSequence": The sequence number of the bus stop that user gets off.
    - "DistanceFrom": The direct distance (km) from  to the bus stop that user gets on.
    - "DistanceTo": The direct distance (km) from destination to the bus stop that user gets off.
    - "TravelTime": The time (seconds) it take to take the bus.
    - "WaitTime": The time (seconds) need to wait for the bus at the beginning bus stop.
    """

    # Find those near stops
    threshold = 0.5
    nearstops = find_near_stops(to_lat, to_lon, threshold)
    print(f"Find {len(nearstops)} bus stops around destination.")

    # Retrieve the route data according to nearstops
    possible_routes = []
    for i in range(len(nearstops)):
        get_on_stops = RouteStop[f'{nearstops[i]["RouteName"]}_{nearstops[i]["Direction"]}'][0:nearstops[i]["StopSequence"]]
        for j in range(len(get_on_stops)):
            from_stop, to_stop = get_on_stops[j], nearstops[i]
            from_time = 1000 # GetBusArrivalTime(to_stop["RouteName"], to_stop["BusType"], to_stop["Direction"], from_stop["StopSequence"])
            to_time = 100 # GetBusArrivalTime(to_stop["RouteName"], to_stop["BusType"], to_stop["Direction"], to_stop["StopSequence"])
            
            if from_time < 0 or to_time < 0:
                break
            
            distance_from = distance(from_lat, from_lon, from_stop["Lat"], from_stop["Lon"])
            distance_to = distance(to_lat, to_lon, to_stop["Lat"], to_stop["Lon"])
            travel_time  = to_time - from_time
            wait_time = from_time

            possible_routes.append({
                "RouteName": to_stop["RouteName"], 
                "BusType": to_stop["BusType"],
                "Direction": to_stop["Direction"],
                "FromStopName": from_stop["StopName"],
                "FromStopSequence": from_stop["StopSequence"],
                "ToStopName": to_stop["StopName"], 
                "ToStopSequence": to_stop["StopSequence"],
                "DistanceFrom": distance_from, 
                "DistanceTo": distance_to, 
                "TravelTime": travel_time, 
                "WaitTime": wait_time
            })
    
    print(f"There are {len(possible_routes)} possible routes currently.")

    # Sorting all possible routes
    sorted_routes = sorted(possible_routes, key= lambda route: score(route["DistanceFrom"], route["DistanceTo"], route["TravelTime"], route["WaitTime"]))

    # Return the optimize result
    return sorted_routes


result = routing(24.780765, 120.989119, 24.817373, 120.996565)
for i in range(len(result)):
    print(result[i])
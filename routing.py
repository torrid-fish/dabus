import json
from math import radians, cos, sin, asin, sqrt
from utility import GetBusArrivalTime, GetWalkingTime

with open("./StopList.json", "r", encoding="utf-8") as f:
    StopList = json.loads(f.read())

with open("./RouteStop.json", "r", encoding="utf-8") as f:
    RouteStop = json.loads(f.read())

with open("./Schedule.json", "r", encoding="utf-8") as f:
    Schedule = json.loads(f.read())

def getOffSet(route, sequence_number):
    t1 = Schedule[route][0]["StopTimes"][sequence_number-1]["ArrivalTime"][3:5]
    t2 = Schedule[route][0]["StopTimes"][sequence_number]["ArrivalTime"][3:5]
    return (int(t1) - int(t2)) * 60

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

def score(from_walk_time, to_walk_time, travel_time, waiting_time):
    """
    Score the route based on given parameters.
    """
    a, b, c, d = 1, 1, 1, 1
    return a * from_walk_time + b * to_walk_time + c * travel_time + d * waiting_time

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
    maximum = 20
    threshold = 1.0

    while True:
        nearstops = find_near_stops(to_lat, to_lon, threshold)
        if len(nearstops) > maximum:
            threshold /= 2
        else:
            break
        
    print(f"Find {len(nearstops)} bus stops around destination.")

    # Retrieve the route data according to nearstops
    possible_routes = []
    for i in range(len(nearstops)):
        estimated_times = GetBusArrivalTime(nearstops[i]["RouteName"], nearstops[i]["BusType"], nearstops[i]["Direction"])
        if len(estimated_times) == 0:
            continue
        # print(estimated_times)
        buslist = RouteStop[f'{nearstops[i]["RouteName"]}_{nearstops[i]["Direction"]}']
        get_on_stops = buslist[0:nearstops[i]["StopSequence"]-1] # Don't consider get-on and get-off stop be the same
        for j in range(nearstops[i]["StopSequence"]-1):
            from_stop, to_stop = get_on_stops[j], nearstops[i]
            from_time = estimated_times[j]
            to_time = estimated_times[-1]

            if from_time < 0 or to_time < 0:
                continue
            
            distance_from = distance(from_lat, from_lon, from_stop["Lat"], from_stop["Lon"])
            distance_to = distance(to_lat, to_lon, to_stop["Lat"], to_stop["Lon"])
            
            # calculating travel time
            travel_time, last = 0, j
            for k in range(j, len(estimated_times)-1, 1):
                if estimated_times[k] > estimated_times[k+1]:
                    travel_time += estimated_times[k] - estimated_times[last] + getOffSet(f'{to_stop["RouteName"]}_{to_stop["Direction"]}', get_on_stops[k]["StopSequence"])
                    last = k+1

            if last == j:
                travel_time = estimated_times[-1] - estimated_times[j]

            wait_time = from_time

            from_walk_time = GetWalkingTime(from_lat, from_lon, from_stop["Lat"], from_stop["Lon"])
            to_walk_time = GetWalkingTime(to_lat, to_lon, to_stop["Lat"], to_stop["Lon"])

            stops = []
            currentstops = []
            for k in range(len(buslist)):
                stops.append({
                    "name": buslist[k]["StopName"],
                    "arriveTime": estimated_times[k]
                })
                if k > 0 and estimated_times[k] < estimated_times[k-1]:
                    currentstops.append(buslist[k-1]["StopName"])
            
            possible_routes.append({
                "busName": to_stop["RouteName"],
                "departureStop": from_stop["StopName"],
                "destinationStop": to_stop["StopName"],
                "currentStop": currentstops,
                "arriveTime": wait_time / 60,
                "FromStopLat": from_stop["Lat"],
                "FromStopLon": from_stop["Lon"],
                "Stops": stops,
                "BusType": to_stop["BusType"],
                "Direction": to_stop["Direction"],
                "FromStopWalkTime": from_walk_time,
                "ToStopWalkTime": to_walk_time,
                "TravelTime": travel_time, 
                "WaitTime": wait_time
            })
    
    print(f"There are {len(possible_routes)} possible routes currently.")

    # Sorting all possible routes
    sorted_routes = sorted(possible_routes, key= lambda route: score(route["FromStopWalkTime"], route["ToStopWalkTime"], route["TravelTime"], route["WaitTime"]))

    # Return the optimize result
    return sorted_routes


if __name__ == '__main__':
    result = routing(24.801818, 120.971263, 24.798355, 120.994509)
    for i in range(len(result)):
        print(result[i])
import json

f = json.loads(open('CityBus.json', 'r').read())
print(len(f))
f = json.loads(open('CountyBus.json', 'r').read())
print(len(f))
f = json.loads(open('InterCityBus.json', 'r').read())
print(len(f))

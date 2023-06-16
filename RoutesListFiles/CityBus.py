import json

MainLine = set()
Branch = set()

data = json.loads(open('CityBus.json', 'r').read())

for i in data:
    if(i['RouteName']['Zh_tw'] == i['SubRouteName']['Zh_tw']):
        MainLine.add(i['RouteName']['Zh_tw'])
    else:
        Branch.add(i['SubRouteName']['Zh_tw'])

for i in MainLine:
    print('"{}",'.format(i))

for i in Branch:
    print('"{}",'.format(i))
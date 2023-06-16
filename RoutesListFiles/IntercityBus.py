MainLine = set()
Branch = set()
for i in open('IntercityBus.html').read().split('</option>'):
    temp = i[i.find('【')+1:i.find('】')]
    if(temp.find('(') == -1):
        MainLine.add(temp)
    else:
        Branch.add(temp.replace('(', '').replace(')', ''))

for i in MainLine:
    print('"{}",'.format(i))
for i in Branch:
    print('"{}",'.format(i))
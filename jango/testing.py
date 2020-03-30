import populartimes
import json


placeIDs = []
myKey = "AIzaSyBLMCOvdz6-uGCjEPfYC7TKt0MICGRcK1E"

myPosition_x = 49.505564 
myPosition_y = 5.965662

#preferredTime = float(input("What is your preferred Time? : "))
#0.001 #111.32 m
hundred_meters = 0.0008983 #100m
radius_magnifier = float(input("What radius are you looking for? (in km): "))*10

radius = hundred_meters * radius_magnifier


supermarkets = populartimes.get(myKey, ["grocery_or_supermarket"], (myPosition_x - radius, myPosition_y - radius), (myPosition_x + radius, myPosition_y + radius))

output = []
for supermarket in supermarkets:
    currentOut = {"id":supermarket["id"],
                  "name":supermarket["name"],
                  "address":supermarket["address"],
                  "lat": supermarket["coordinates"]["lat"],
                  "lng": supermarket["coordinates"]["lng"],
                  "populartimes":supermarket["populartimes"]}
    output.append(currentOut)
print(output[0])



'''for i in range(len(supermarkets)):
    print(list(supermarkets[i].values())[1])
    placeIDs.append(list(supermarkets[i].values())[0])
    

with open('output.json', 'w') as outfile:
    outfile.write("[")
    for i in range(len(placeIDs)):
        json.dump(populartimes.get_id(myKey, placeIDs[i]), outfile, indent=4)
        if (i != len(placeIDs)-1):
            outfile.write(",")
    outfile.write("]")

outfile.close()'''



#print(placeIDs)

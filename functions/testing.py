import populartimes
import json
import sys
from flask import Flask, request, jsonify
#import firebase_admin
#from firebase_admin import credentials

#cred = credentials.Certificate(".json")
#firebase_admin.initialize_app(cred)

def getPopularTimes(lat, lng, radius):
    myKey = "AIzaSyBLMCOvdz6-uGCjEPfYC7TKt0MICGRcK1E"
    myPosition_x = float(lat)
    myPosition_y = float(lng)
    radius = float(radius) * 0.008983 #to convert to km and to scale by lat/lng
    supermarkets = populartimes.get(myKey, ["grocery_or_supermarket"], (myPosition_x - radius, myPosition_y - radius), (myPosition_x + radius, myPosition_y + radius))
    outputs = {}
    for supermarket in supermarkets:
        outputs[supermarket["id"]] =  {"name":supermarket["name"],
                                       "address":supermarket["address"],
                                       "lat": supermarket["coordinates"]["lat"],
                                       "lng": supermarket["coordinates"]["lng"],
                                       "populartimes":supermarket["populartimes"]}
    #print(supermarkets)
    output_objs = []
    '''#print(outputs.keys())
    for key in outputs.keys():
        output_str = "{\"" + key + "\"" + ":" + json.dumps(outputs[key]) + "}"
        output_objs.append(output_str)
    return "[" + ','.join(output_objs) + "]"'''
    with open('result.json', 'w') as fp:
        json.dump(outputs, fp)
    return "done"
    #return json.dumps(outputs)


print(getPopularTimes(sys.argv[1], sys.argv[2], sys.argv[3]))
sys.stdout.flush()


'''
app = Flask(__name__)
app.config["DEBUG"] = True


@app.route('/api/v1/getpopulartimes', methods=['GET'])
def getPopularTimes():
    if 'lat' in request.args and 'lng' in request.args and 'radius' in request.args:
        myKey = "AIzaSyBLMCOvdz6-uGCjEPfYC7TKt0MICGRcK1E"
        myPosition_x = float(request.args["lat"])
        myPosition_y = float(request.args["lng"])
        radius = float(request.args["radius"]) * 0.008983 #to convert to km and to scale by lat/lng
        supermarkets = populartimes.get(myKey, ["grocery_or_supermarket"], (myPosition_x - radius, myPosition_y - radius), (myPosition_x + radius, myPosition_y + radius))
        outputs = []
        for supermarket in supermarkets:
            currentOut = {"id":supermarket["id"],
                          "name":supermarket["name"],
                          "address":supermarket["address"],
                          "lat": supermarket["coordinates"]["lat"],
                          "lng": supermarket["coordinates"]["lng"],
                          "populartimes":supermarket["populartimes"]}
            outputs.append(currentOut)
        #print(supermarkets)
        return jsonify(outputs)
    else:
        return 'ERROR: Insufficient inputs provided'
app.run()'''

'''
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
print(output[0])'''



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

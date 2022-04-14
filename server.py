from urllib.request import Request
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
import uvicorn
import pandas as pd
import array as arr  
import sys
import math


app = FastAPI()
origins=["*"]
app.add_middleware(CORSMiddleware,allow_origins=origins)




@app.get("/")
def root():
    return {"hello world"}

@app.get("/locationresult")
def root(location:str):
    locationresult = k_mediod(location)
    return  locationresult
    
@app.get("/locationresult2")
def root(location:str):
    locationresult = k_mediod(location , 2)
    return  locationresult

def k_mediod(location):

    location = location.lower()
    location = location.replace(" " , "")
    city = location

    rental_data = pd.read_csv(r"Data/Rental_Data.csv",encoding='utf-8')
    atm_data = pd.read_csv(r"Data/Atm_Data.csv",encoding='utf-8')
    hospital_data = pd.read_csv(r"Data/Hospital_Data.csv",encoding='utf-8')
    restaurent_data = pd.read_csv(r"Data/Restaurent_Data.csv",encoding='utf-8')


    rental_data = rental_data[rental_data["City"] == city]
    atm_data = atm_data[atm_data["City"] == city]
    hospital_data = hospital_data[hospital_data["City"] == city]
    restaurent_data = restaurent_data[restaurent_data["City"] == city]


    # # concatinaitng data
    atm_data = atm_data[["Address" , "Latitude" , "Longitude","Easting" , "Northing" , "Type"]]
    hospital_data = hospital_data[["Address" , "Latitude" , "Longitude","Easting" , "Northing" , "Type"]]
    restaurent_data = restaurent_data[["Address" , "Latitude" , "Longitude","Easting" , "Northing" , "Type"]]
    data = pd.concat([atm_data, hospital_data , restaurent_data], axis=0, ignore_index=True)

    

    #colouring rental
    uniquecolor = len(rental_data)
    colorlist = []
    for i in range(uniquecolor):
        colorlist.append(i)
    rental_data['color'] = colorlist


    # if(type == 2):
    #     rental_data_list = rental_data.values.tolist()
    #     rentaljson = json.dumps(rental_data_list)
    #     return rentaljson

    #filering latitude and longitude
    rental_list = rental_data[["Easting" , "Northing" , "color"]].values.tolist()
    data_list = data[["Easting" , "Northing"]].values.tolist()


    data_color_list = []
    dist = 1000000000
    for itr in data_list:
        east1 = itr[0]
        north1 =  itr[1]  
        dist = sys.maxsize
        c = -1
        for rooms in rental_list:
            east2 = rooms[0]
            north2 = rooms[1]
            color_type = int(rooms[2])
            currdist = math.sqrt((pow(abs((east1 - east2)) , 2) + pow(abs((north1 - north2)) , 2)))
            if currdist < dist:
                dist = currdist
                c = color_type
        data_color_list.append(c)
    data['color'] = data_color_list

    # print(data)

    datalist = data.values.tolist()
    rental_data_list = rental_data.values.tolist()
    datalist = rental_data_list + datalist
    datajson = json.dumps(datalist)

    # data = data.to_json(orient='column')

    return datajson    



uvicorn.run(app, host="0.0.0.0", port=8000)




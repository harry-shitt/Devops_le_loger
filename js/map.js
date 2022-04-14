
let map;
let markers = [];
let geocoder;
let responseDiv;
let response;






function setMapOnAll(map) {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

function hideMarkers() {
  setMapOnAll(null);
}


function deleteMarkers() {
  hideMarkers();
  markers = [];
}


function pinSymbol(color) {
  return {
    path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z',
    fillColor: color,
    fillOpacity: 1,
    strokeColor: '#000',
    strokeWeight: 2,
    scale: 2
  };
}



function initMap()
{
    var location = {lat:19.418864 , lng:72.815619};
    map = new google.maps.Map(document.getElementById("map") , {
        zoom:13, 
        center : location
    });
    var marker = new google.maps.Marker({
        position : location ,
        map: map
    });
    markers.push(marker);
    setMapOnAll(map);
    geocoder = new google.maps.Geocoder();    
}


  function codeAddress(address) 
    {
        deleteMarkers()
    geocoder.geocode( {address:address}, function(results, status) 
    {
        if (status == google.maps.GeocoderStatus.OK) 
        {
        map.setCenter(results[0].geometry.location);//center the map over the result
        var marker = new google.maps.Marker(
        {
            map: map,
            position: results[0].geometry.location
        });
        markers.push(marker);
        setMapOnAll(map);
        } else {
        alert('Geocode was not successful for the following reason: ' + status);
    }
    });
    }

   
      function decription(price  , buildingname , roomtype , desc)
      {
          buildingname = String(buildingname);
          buildingname = buildingname.replace('\n' , ' ');
          desc  = desc.replace('\n' , ' ');
          result = "It is a " + String(roomtype) + ' in ' + buildingname + ' Price : ' + String(price) + ' Description : ' +String(desc);
            return result;
      }



function findplace()
{
    var place , location;
    place = document.getElementById('placename');
    location = document.getElementById('location');
    place = place.value;
    location = location.value;
    document.getElementById('placename').value = "";
    document.getElementById('location').value = "";


    address = place +" ," + location;
    codeAddress(address);

    var clustringnodelist = [] , clusteringcenterlist = [];
   let url1=new URL( "http://localhost:8000/locationresult")
   url1.searchParams.append('location',location)
    fetch(url1)
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data)
        var marker;
        for(var i=0;i<data.length;i++)
        {
            if(data[i].length > 7)
            {
                marker = new google.maps.Marker(
                    {
                        map: map,
                        position: {lat:data[i][1] , lng:data[i][2]},
                        title : decription(data[i][0] , data[i][6] , data[i][7] , data[i][8]),
                        icon : "assets/images/house.png",                    
                        opacity : 10,
                      });
                    markers.push(marker);   
            }
            else
            {
                
                marker = new google.maps.Marker(
                    {
                        map: map,
                        position: {lat:data[i][1] , lng:data[i][2]},
                        title : String(data[i][5]),
                        opacity : 0.7,
                        icon: "assets/markers/" + String(data[i][6]) +".png"
                    });
                    markers.push(marker);
            }
        }
        setMapOnAll(map);

    });   


}








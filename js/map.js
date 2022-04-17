
let map;
let markers = [];
let amenditiesmarekr = [];
let rentalmarker = [];
let geocoder;
let responseDiv;
let response;
var place , location;
let rentallocationlist =[];

function getString(price  , buildingname , roomtype , desc)
{
    
    let contentString =
    '<div id="content">' +
    '<div id="siteNotice">' +
    "</div>" +
    '<div id="bodyContent">' +
    "<h3><b>Building Name</b>"+"&#160;"+ getprice(buildingname)+ "&#160;" +"</h3>"+
    "<h3><b>Price</b>"+"&#160;"+ getbuildingname(price)+ "&#160;" +"</h3>"+
    "<h3><b>Room</b>"+"&#160;"+ gettype(roomtype)+ "&#160;" +"</h3>"+
    "<h3><b>Description</b>"+"&#160;"+ getdesc(desc)+ "&#160;" +"</h3>"+
    "</div>" +
    "</div>";
    return contentString;
}

function getprice(price)
{
    return String(price);
}

function getbuildingname(buildingname)
{
    buildingname = buildingname.replace('\n' , ' ');
    return buildingname;
}

function gettype(type)
{
    return(type);
}

function getdesc(desc)
{
    desc  = desc.replace('\n' , ' ');
    return String(desc);
}

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


// amenditeis 
function setamenditiesmarker(map)
{
    for (let i = 0; i < amenditiesmarekr.length; i++) {
        amenditiesmarekr[i].setMap(map);
      }
}

function hideamenditiesmarkers() {
    setamenditiesmarker(null);
  }
  
  
function deleteamenditiesMarkers() {
    hideamenditiesmarkers();
    amenditiesmarekr = [];
}


  // rental 
function setrentalmarker(map)
{
    for (let i = 0; i < rentalmarker.length; i++) {
        rentalmarker[i].setMap(map);
    }
}

function hiderentalmarkers() {
    setrentalmarker(null);
}
  
  
function deleterentalMarkers() {
    hiderentalmarkers();
    rentalmarker = [];
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
        deleteamenditiesMarkers()
        deleterentalMarkers()
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




function finddistance()
{

    




    for(var  i=0 ; i < rentallocationlist.length;i++)
    {
        let marker = new google.maps.Marker(
        {
            map: map,
            position: {lat:rentallocationlist[i][1] , lng:rentallocationlist[i][2]},
            icon : "assets/images/house.png",                    
            opacity : 10,
        });
        let infowindow = new google.maps.InfoWindow({
            content: getString(rentallocationlist[i][0] , rentallocationlist[i][6] , rentallocationlist[i][7] , rentallocationlist[i][8]),
        });
        marker.addListener("click", () => {
            infowindow.open({
                anchor: marker,
                map,
                shouldFocus: true,
            });
        });
        rentalmarker.push(marker); 
    }
    setrentalmarker(map);
}


function findplace()
{
   
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
        data = JSON.parse(data);
        rentallocationlist = [];
        for(var i=0;i<data.length;i++)
        {
            if(data[i].length > 7)
            {
                rentallocationlist.push(data[i]);
                // let marker = new google.maps.Marker(
                // {
                //     map: map,
                //     position: {lat:data[i][1] , lng:data[i][2]},
                //     icon : "assets/images/house.png",                    
                //     opacity : 10,
                // });
                // let infowindow = new google.maps.InfoWindow({
                //     content: getString(data[i][0] , data[i][6] , data[i][7] , data[i][8]),
                // });
                // marker.addListener("click", () => {
                //     infowindow.open({
                //         anchor: marker,
                //         map,
                //         shouldFocus: true,
                //     });
                // });
                // rentalmarker.push(marker);   
            }
            else
            {
                let marker = new google.maps.Marker(
                    {
                        map: map,
                        position: {lat:data[i][1] , lng:data[i][2]},
                        title : String(data[i][5]),
                        opacity : 0.7,
                        icon: "assets/markers/" + String(data[i][6]) +".png"
                    });
                    amenditiesmarekr.push(marker);
            }
        }
        finddistance();
        setamenditiesmarker(map);
    });   


}








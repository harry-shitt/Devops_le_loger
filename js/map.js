// 

//AIzaSyChDoqgAPHt94rUgtRfzO3OZGe2_weJF0A


// le loger AIzaSyA67RKcaqHa8ZdNclngrwKbrVOuJVmVXdo


function findplace()
{
    var temp="just to check if it works inside fetch"
    var place , location;
    place = document.getElementById('placename');
    location = document.getElementById('location');
    place = place.value;
    location = location.value;
    document.getElementById('placename').value = "";
    document.getElementById('location').value = "";

    var clustringnodelist = [] , clusteringcenterlist = [];
   let url1=new URL( "http://localhost:8000/locationresult1")
   url1.searchParams.append('location',location)
    fetch(url1)
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data)
        // console.log(data);
        // console.log(data[0][1])//latitude
        // console.log(data[0][2])//longitutde
        console.log(findcolor(data[0][6]))//color
    });   

    let url2=new URL( "http://localhost:8000/locationresult2")
   url2.searchParams.append('location',location)
    fetch(url2)
    .then(
        response=>response.json()
        )
    .then(data => {
        // 0 -> price , 1,2->lat,long  , 6,7 ->location and 1/2bhk
        data = JSON.parse(data)
        console.log(data)
    })
    console.log("reached mapcall")
    // mapcall()
    moveToLocation(-33.890542 , 151.274856)
}

function findcolor(number)
{
    colordict = {0:"#D52771",1:"#000000",2:"#FF0013",3:"#FF00FB",4:"#FF00FB",5:"#009FFD",6:"#00E8FD",7:"#00FD88",8:"#83FD00",9:"#DFFD00",10:"#FDAC00",11:"#FD1F00",12:"#F7C8C1",13:"#906E69",14:"#712D23",15:"#FFFF5D",16:"#55D6DB",17:"#B44BEF",18:"#840E50",19:"#A10B1E",20:"#A3E04E"}
    return colordict[number]
}

function mapcall()
{
    var locations = [
        ['Bondi Beach', -33.890542, 151.274856, 4],
        ['Coogee Beach', -33.923036, 151.259052, 5],
        ['Cronulla Beach', -34.028249, 151.157507, 3],
        ['Manly Beach', -33.80010128657071, 151.28747820854187, 2],
        ['Maroubra Beach', -33.950198, 151.259302, 1]
        ];

        var infowindow = new google.maps.InfoWindow();

        var marker, i;
        
        for (i = 0; i < locations.length; i++) {  
        marker = new google.maps.Marker({
            position: new google.maps.LatLng(locations[i][1], locations[i][2]),
            map: map
        });
        
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
            infowindow.setContent(locations[i][0]);
            infowindow.open(map, marker);
            }
        })(marker, i));
        }

}

function moveToLocation(lat, lng){
    const center = new google.maps.LatLng(lat, lng);
    // using global variable:
    window.map.panTo(center);
  }
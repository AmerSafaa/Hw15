
// Store API  
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

var map = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiYW1lcnNhZmFhIiwiYSI6ImNqZWJqcnppeDBjbGMzNG85ajF5NHdvcngifQ.gHaxtt-vGy-1X95msVwM9w"); 

faultsURL = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"
 
var satmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?" + "access_token=pk.eyJ1IjoiYW1lcnNhZmFhIiwiYSI6ImNqZWJqcnppeDBjbGMzNG85ajF5NHdvcngifQ.gHaxtt-vGy-1X95msVwM9w"); 
 

var earthquakes = new L.layerGroup(); 
var faults = new L.layerGroup(); 
 
var myMap = L.map("map", { 
   center: [37.09, -95.71], 
   zoom: 4, 
   layers: [map, earthquakes] 
 }); 
 
 
  function styleData(feature) { 
   return { 
     stroke: false, 
     fillOpacity: .7, 
     fillColor: getColor(feature.properties.mag), 
     radius: circRad(feature.properties.mag)     
     }; 
   } 
 
   function getColor(mag){ 
     switch(true){ 
       case mag < 1: 
         return "#CC3300"; 
       case mag < 2: 
         return "#FF9966"; 
       case mag < 3: 
         return "#CCCC66"; 
       case mag < 4: 
         return "#FFCC66"; 
       case mag < 5: 
         return "#FF9966"; 
       default: 
         return "#FF6666"; 
   }}; 
 
 
function circRad(r) { 
     return r*7; 
   } 
 
  
L.geoJSON(response, { 
     pointToLayer: function(feature, latlng) { 
       return L.circleMarker(latlng); 
     }, 
     style: styleData
     } 
 
   }).addTo(earthquakes); 
   earthquakes.addTo(myMap); 

}) 

 
// Satellite map 
 
var baseMaps = { 
   "Map": map, 
   "Satellite Map": satmap 
 }; 
 
 
var overlayMaps = { 
   "Earthquakes": earthquakes, 
   "Plates": faults 
 }; 
 

L.control.layers(baseMaps, overlayMaps, { 
   collapsed: false 
 }).addTo(myMap); 
 

d3.json(faultsURL, function(response) { 
   function faultStyle(feature) { 
     return { 
       weight: 2, 
       color: "orange" 
     }; 
   } 
 
 
   L.geoJSON(response, { 
     style: faultStyle 
   }).addTo(faults); 
   faults.addTo(myMap) 
 }) 


 // Legend 
var legend = L.control({position: 'bottomright'}); 
 
function getColor(d) { 
    return d <= 1 ? "#66FF66": 
           d <= 2 ? "#CCFF33": 
           d <= 3 ? "#CCCC66": 
           d <= 4 ? "#FFCC66": 
           d <= 5 ? "#FF9966": 
           d > 5 ? "#FF6666": 
                   "#ffffff"; 
   } 
 
 
legend.onAdd = function (map) { 
 
 
     var div = L.DomUtil.create('div', 'info legend'), 
         grades = [0, 1, 2, 3, 4, 5], 
         labels = ["Minor", "Light","Moderate","Strong","Major","Great"]; 
 
 
      
     for (var i = 0; i < grades.length; i++) { 
         div.innerHTML += 
             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' + 
             labels[i] + '<br>' ; 
     } 
 
 
     return div; 
 }; 
 
 
legend.addTo(myMap); 


// Layers

var overlayMaps = { 
     "Earthquakes": earthquakes, 
     "Fault lines": faults 
 }; 
 var baseMaps = { 
     "Grayscale": lightMap, 
     "Satellite": satMap 
 }; 
 
 
 L.control.layers(baseMaps, overlayMaps, { 
     collapsed: true 
 }).addTo(myMap); 


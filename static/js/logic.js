var map = L.map("map", {center: [-115.6985,36.733,],zoom: 8});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(map);

var data = "../data/earthquakes.json";
var geodata;

d3.json(data, function(data){
    geodata = L.choropleth(data,{
        valueProperty: "MHI2016",
        scale: ["#F4D03F","#B80303"],
        steps:10,
        mode:"q",
        style:{
            color:"#fff",
            weight:1,
            fillOpacity:0.8
        },
        onFeature: function(feature,layer){
            layer.bindPopup("Zip Code " + feature.properties.zip + "<br>Earthquake");
        }
    }).addTo(map);
    
})
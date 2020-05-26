var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson";

d3.json(url,function(data){
    createFeatures(data.features);
})

function createFeatures(data){
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    }

    var earthquakes = L.geoJSON(data, {
    onEachFeature: onEachFeature
    });

    createMap(earthquakes,data);
}

function createMap(earthquakes,data){
    var satellite =L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var outdoors =L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.outdoors",
        accessToken: API_KEY
    });

    var v8 =L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.mapbox-streets-v8",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Satellite": satellite,
        "Outdoors": outdoors,
        "Retro": v8
    };
    
    var overlayMaps = {
    Earthquakes: earthquakes
    };

    var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4,
    layers: [satellite,outdoors,v8, earthquakes]
    });
    
      L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
      }).addTo(map);

    //createCircles
    for(i in data){
        var features = data[i];
        var color = "";
        if (features.properties.mag >= 5) {
            color = "#B80303";
        }
        else if (features.properties.mag > 4) {
            color = "#DA6823";
        }
        else if (features.properties.mag > 3) {
            color = "#D68B00";
        }
        else if (features.properties.mag > 2) {
            color = "#D6AC00";
        }
        else if (features.properties.mag > 1) {
        color = "#D6D300";
        }
        else {
            color = "#ACD600";
        }

        //get the correct coordinates
        var coords = features.geometry.coordinates;
        coords = [coords[1], coords[0]];
    
        L.circle(coords, {
            fillOpacity: 0.75,
            color: "white",
            fillColor: color,
            // Adjust radius
            radius: features.properties.mag * 100000
        }).addTo(map)/*.bindPopup("<h1>" + features.place + "</h1> <hr> <h3>Magnatude: " + features.properties.mag + "</h3>");*/
    } 
    var legend = L.control({position: "bottomleft"});
        var colors = ["#B80303","#DA6823","#D68B00","#D6AC00","#D6D300","#ACD600"];
        labels = ["0-1","1-2","2-3","3-4","4-5","5+"];

        legend.onAdd = function(map) {
        
            var div = L.DomUtil.create('div', 'legend');
            div.innerHTML += "<h4>Magnatude</h4>";    
            div.innerHTML += '<i style="background: ' + colors[5] + '"></i><span>'+ labels[0] +'</span><br>';
            div.innerHTML += '<i style="background: ' + colors[4] + '"></i><span>'+ labels[1] +'</span><br>';
            div.innerHTML += '<i style="background: ' + colors[3] + '"></i><span>'+ labels[2] +'</span><br>';
            div.innerHTML += '<i style="background: ' + colors[2] + '"></i><span>'+ labels[3] +'</span><br>';
            div.innerHTML += '<i style="background: ' + colors[1] + '"></i><span>'+ labels[4] +'</span><br>';
            div.innerHTML += '<i style="background: ' + colors[0] + '"></i><span>'+ labels[5] +'</span><br>';
            // loop through our density intervals and generate a label with a colored square for each interval
            
            return div;
        };
        
        legend.addTo(map);
}




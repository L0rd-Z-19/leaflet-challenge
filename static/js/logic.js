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
}




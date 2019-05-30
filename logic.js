// Store our API endpoint 
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_week.geojson"

// function markerSize(mag) {
//   return mag * 30000;
// }

//Blue color spectrum for magnitudes
function markerColor(mag) {
  if (mag <= 1) {
      return "#172b91";
  } else if (mag <= 2) {
      return "#1850a0";
  } else if (mag <= 3) {
      return "#1d7fad";
  } else if (mag <= 4) {
      return "#20a6b2";
  } else if (mag <= 5) {
      return "#47e8f7";
  } else {
      return "#e0e0e0";
  };
}

// Perform a GET request to the query URL
d3.json(link, function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});
function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    var earthquakes = L.geoJSON(earthquakeData {
        onEachFeature : function (feature, layer) {
            layer.bindPopup("<h3> Location: " + feature.properties.place + 
            "</h3><hr><p>" + new Date(feature.properties.time) +
            "</p> Magnitude: " +feature.properties.mag + "</p>")},
                pointToLayer: function (feature, latlng) {
            return new L.circle(latlng,{
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.properties.mag),
                fillOpacity: 1,
                stroke: false,
            })
    }
    });

    // Sending our earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    const satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.satellite",
            accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Satellite Map": satellitemap,
            "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [satellitemap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);
}

//legend
var legend = L.control({position: "topright"});
legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend"),
    magnitudes = [0, 1, 2, 3, 4, 5];
    for (var i = 0; i < magnitudes.length; i++) {
        div.innerHTML +=
            '< i style="background: ' + markerColor(magnitudes[i] + 1) + '"></i>  ' + 
  + magnitudes[i] + (magnitudes[i + 1] ? ' - ' + magnitudes[i + 1] + '<br>' : ' + ');
  }
  return div;
};

legend.addTo(myMap);
}

// function to pull data and wait for response
(async function(){
    const queryUrl = buildUrl();
    const data = await d3.json(queryUrl);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
})()

// Adding the tile layer
let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

let baseMaps = {"Street View" : streetmap,
                "Topographical View" : topomap}

let colors = ["#DCDCDC", "#A9A9A9", "#696969", "#778899", "#191970", "#000000"]              

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(data) {return data * 70000};

function color_choice(data) {

    if (data > -10 & data <= 10) return "#DCDCDC";
    else if (data > 10 & data <= 30) return "#A9A9A9";
    else if (data > 30 & data <= 50) return "#696969";
    else if (data > 50 & data <= 70) return "#778899";
    else if (data > 70 & data <= 90) return "#6495ED";
    else return "#A52A2A";
    };


d3.json(url).then(data => {
    
    let points = data.features;
    let earthquake_marker_group = L.layerGroup()

    points.forEach(point => {
                            let lat = point.geometry.coordinates[1];
                            let lng = point.geometry.coordinates[0];
                            let depth = point.geometry.coordinates[2];
                            let coords = [lat, lng, depth]
                            let mag = point.properties.mag
                            let place = point.properties.place
                            earthquake_markers = L.circle(coords, {
                                                          stroke: true,
                                                          color:"black",
                                                          weight:0.25,
                                                          fillOpacity: 1,
                                                          fillColor: color_choice(point.geometry.coordinates[2]),
                                                          radius: markerSize(point.properties.mag),
                                                          interactive: true
                                                        });
                            earthquake_markers.bindPopup(`Earthquake Location :${place} : Magnitude: ${mag}`)
                            earthquake_markers.addTo(earthquake_marker_group)
                                });

    
    let overlayMaps = {"earthquakes" : earthquake_marker_group}
    // Creating the map object
    var myMap = L.map("map", {
    center: [42.97, -56.69],
    zoom: 2,
    layers: [topomap, earthquake_marker_group]
    });
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);



    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      var limits = ["-10 to 10", "10 to 30", "30 to 50", "50 to 70", "70 to 90", "90+"];
      var colors = ["#DCDCDC", "#A9A9A9", "#696969", "#778899", "#6495ED", "#A52A2A"];
      var labels = [];
      
      var legendInfo = "<h3>Earth Depth</h3>"

      div.innerHTML = legendInfo;

      limits.forEach(function(limit, index) {
        labels.push("<li style=\"background-color: " + colors[index] + "\">"+ limits[index] +"</li>");
      });
  
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
      return div;
    };
  
    // Adding the legend to the map
    legend.addTo(myMap);
    
    
  });

// let Legend = L.addLegend("bottomright", 
// colors =["#DCDCDC", "#A9A9A9", "#696969", "#778899", "#191970", "#000000"],
// labels= ["-10 to 10", "10 to 30", "30 to 50", "50 to 70", "70 to 90", "90+"],
// title= "Depth of Earth",
// opacity = 1)

// Legend.addTo(myMap)


// polyline //


// Creating the map object
var myMap = L.map("map", {
    center: [42.97, -56.69],
    zoom: 2
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

function markerSize(data) {return data * 60000};

function color_choice(data) {

    if (data > -10 & data <= 10) return "#7FFF00";
    else if (data > 10 & data <= 30) return "#008000";
    else if (data > 30 & data <= 50) return "#FFD700";
    else if (data > 50 & data <= 70) return "#FF8C00";
    else if (data > 70 & data <= 90) return "#CD5C5C";
    else return "#8B0000";
    };


d3.json(url).then(data => {
    console.log(data.features[50])
    
    let earthquake_markers = [];
    let points = data.features;
    
    points.forEach(point => {
                            let lat = point.geometry.coordinates[1];
                            let lng = point.geometry.coordinates[0];
                            let depth = point.geometry.coordinates[2];
                            let coords = [lat, lng, depth]
                            
                            earthquake_markers.push(
                                                L.circle(coords, {
                                                    stroke: false,
                                                    fillOpacity: 0.75,
                                                    color: "black",
                                                    fillColor: color_choice(point.geometry.coordinates[2]),
                                                    radius: markerSize(point.properties.mag)
                                                    }));
                                });

    let earthquake_marker_group = L.layerGroup(earthquake_markers)
    let overlayMaps = {"earthquakes" : earthquake_marker_group}
    L.control.layers(overlayMaps).addTo(myMap);
});


// polyline //
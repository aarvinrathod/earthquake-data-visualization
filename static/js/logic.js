// Creating the map object
var myMap = L.map("map", {
    center: [42.97, -56.69],
    zoom: 2
  });

// Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);


url = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02"

function markerSize(data) {return data * 50000};


d3.json(url).then(data => {
    // console.log(data.features[0])
    
    let earthquake_markers = [];
    let points = data.features;
    // points.forEach(point => {
    //     let coords = point.geometry.coordinates;
    //     marker = L.marker(coords);
    //     marker.addTo(myMap)
    points.forEach(point => {
        earthquake_markers.push(
            L.circle(point.geometry.coordinates, {
                                                stroke: false,
                                                fillOpacity: 0.75,
                                                color: point.geometry.coordinates[2],
                                                fillColor: point.geometry.coordinates[2],
                                                radius: markerSize(point.properties.mag)
                                            })
      );
    });
    let earthquake_marker_group = L.layerGroup(earthquake_markers)
    let overlayMaps = {"earthquakes" : earthquake_marker_group}
    L.control.layers(overlayMaps).addTo(myMap);
});
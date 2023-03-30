mapboxgl.accessToken = 'pk.eyJ1IjoiZGFiYXRvdWtpbiIsImEiOiJjbGFsY255N3AwNGQ2NDF0YWxuZHBmbjR1In0.AyxIdTiW3MUfAaHJgmO2iA';
        
const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12', // style URL
    center: [27.54875, 53.89310], // starting pos[lng, lat]
    zoom: 19, // starting zoom
    pitch: 40,
    bearing: 20,
    antialias: true
});

map.on('load', () => {
    map.addSource('floorplan', {
        'type': 'geojson',
        'data': 'geo-bsu.geojson'
        });
    map.addLayer({
        'id': 'room-extrusion',
        'type': 'fill-extrusion',
        'source': 'floorplan',
        'paint': {
            // Get the `fill-extrusion-color` from the source `color` property.
            'fill-extrusion-color': ['get', 'color'],
        
            // Get `fill-extrusion-height` from the source `height` property.
            'fill-extrusion-height': ['get', 'height'],
            
            // Get `fill-extrusion-base` from the source `base_height` property.
            'fill-extrusion-base': ['get', 'base_height'],
        
            // Make extrusions slightly opaque to see through indoor walls.
            'fill-extrusion-opacity': 0.5}
    })
});   
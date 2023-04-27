// eslint-disable-next-line no-undef
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFiYXRvdWtpbiIsImEiOiJjbGc0NWc1NWQwYnh6M3RxZWJpNmV2azBiIn0.ea4gLzFvVXOv9ttQR_7GaQ';

// eslint-disable-next-line no-undef
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/mapbox/streets-v12', // style URL
  center: [27.54875, 53.89310], // starting pos[lng, lat]
  zoom: 19, // starting zoom
  pitch: 40,
  bearing: 20,
  antialias: true,
});

map.on('load', () => { // execute after map has finished loading
 
  map.addSource('geo-src-outside', {
    type: 'geojson',
    data: 'geo-bsu.geojson',
  });
  map.addLayer({
    id: 'geo-outside',
    type: 'fill-extrusion',
    source: 'geo-src-outside',
    layout: {
      // make the layer visible by default.
      visibility: 'none',
    },
    paint: {
      // get the extrusion parameters from the source properties
      'fill-extrusion-color': ['get', 'color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 0.5,
    },
  });

  map.addSource('geo-src-1', { // 1st floor
    type: 'geojson',
    data: 'geo-1.geojson',
  });
  map.addLayer({
    id: 'geo-1',
    type: 'fill-extrusion',
    source: 'geo-src-1',
    layout: {
      // disable layer by default.
      visibility: 'visible',
    },
    paint: {
      'fill-extrusion-color': ['get', 'color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 0.5,
    },
  });

  map.addSource('geo-src-2', { // 2nd floor
    type: 'geojson',
    data: 'geo-2.geojson',
  });
  map.addLayer({
    id: 'geo-2',
    type: 'fill-extrusion',
    source: 'geo-src-2',
    layout: {
      // disable layer by default.
      visibility: 'none',
    },
    paint: {
      'fill-extrusion-color': ['get', 'color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 0.5,
    },
  });
});

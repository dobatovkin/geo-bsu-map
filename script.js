// eslint-disable-next-line no-undef
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFiYXRvdWtpbiIsImEiOiJjbGc0NWc1NWQwYnh6M3RxZWJpNmV2azBiIn0.ea4gLzFvVXOv9ttQR_7GaQ';

// eslint-disable-next-line no-undef
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/dabatoukin/clgzr3dt200bs01qtgo751g7u', // style URL
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

// after the last frame rendered before the map enters an "idle" state.
map.on('idle', () => {
  // if these two layers were not added to the map, abort
  if (!map.getLayer('geo-outside') || !map.getLayer('geo-1') || !map.getLayer('geo-2')) {
    return;
  };
  
  // enumerate ids for layers
  const toggleableLayerIds = ['geo-1', 'geo-2', 'geo-outside'];
  
  for (const id of toggleableLayerIds) {
    // skip layers that already have a button set up.
    if (document.getElementById(id)) {
        continue;
    }

    // Create a link.
    const link = document.createElement('input');
    link.id = id;
    link.type = 'radio';
    link.href = '#';
    link.textContent = id;
    link.className = 'active';

    const label = document.createElement('label');
    label.for = id;
    // label.appendChild('1');

    // Show or hide layer when the toggle is clicked.
    link.onclick = function (e) {
        const clickedLayer = this.textContent;
        e.preventDefault();
        e.stopPropagation();

        const visibility = map.getLayoutProperty(
            clickedLayer,
            'visibility'
        );

        // Toggle layer visibility by changing the layout object's visibility property.
        if (visibility === 'visible') {
            map.setLayoutProperty(clickedLayer, 'visibility', 'none');
            this.className = '';
        } else {
            this.className = 'active';
            map.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
            );
        }
    };

    const layers = document.getElementById('level-menu');
    layers.appendChild(link);
}
});
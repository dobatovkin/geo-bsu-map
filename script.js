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
    data: '3level.geojson',
  });
  map.addLayer({
    id: 'geo-outside',
    type: 'fill-extrusion',
    source: 'geo-src-outside',
    layout: {
      // make the layer visible by default
      visibility: 'visible',
    },
    paint: {
      // get the extrusion parameters from the source properties
      'fill-extrusion-color': ['get', 'Color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 0.5,
    },
  });

  map.addSource('geo-src-1', { // 1st floor
    type: 'geojson',
    data: '1level.geojson',
  });
  map.addLayer({
    id: 'geo-1',
    type: 'fill-extrusion',
    source: 'geo-src-1',
    layout: {
      // disable layer by default
      visibility: 'none',
    },
    paint: {
      'fill-extrusion-color': ['get', 'Color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 0.5,
    },
  });

  map.addSource('geo-src-2', { // 2nd floor
    type: 'geojson',
    data: '2level.geojson',
  });
  map.addLayer({
    id: 'geo-2',
    type: 'fill-extrusion',
    source: 'geo-src-2',
    layout: {
      // disable layer by default
      visibility: 'none',
    },
    paint: {
      'fill-extrusion-color': ['get', 'Color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 0.5,
    },
  });


  map.addSource('geo-src-3', { // 3nd floor
    type: 'geojson',
    data: '3level.geojson',
  });
  map.addLayer({
    id: 'geo-3',
    type: 'fill-extrusion',
    source: 'geo-src-3',
    layout: {
      // disable layer by default
      visibility: 'none',
    },
    paint: {
      'fill-extrusion-color': ['get', 'Color'],
      'fill-extrusion-height': ['get', 'height'],
      'fill-extrusion-base': ['get', 'base_height'],
      'fill-extrusion-opacity': 0.5,
    },
  });
});

// after the last frame rendered before the map enters an "idle" state
map.on('idle', () => {
  // if these layers were not added to the map, abort
  if (!map.getLayer('geo-outside') || !map.getLayer('geo-1') || !map.getLayer('geo-2') || !map.getLayer('geo-3')) {
    return;
  };

  // enumerate ids for layers
  const toggleableLayerIds = ['geo-1', 'geo-2', 'geo-3', 'geo-outside'];

  let activeLayer = 'geo-outside'

  for (const id of toggleableLayerIds) {
    // skip layers that already have a button set up.
    if (document.getElementById(id)) {
      continue;
    }

    // create a checkbox w/ event
    const link = document.createElement('input');
    link.id = id;
    link.type = 'checkbox';
    link.className = 'active';

    const initialVisibility = map.getLayoutProperty(
      id,
      'visibility'
    );

    // set check if layer is visible initially
    if (initialVisibility === 'visible') {
      link.checked = true;
    }

    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = id;

    // show or hide layer when the toggle is clicked
    link.onclick = function (e) {
      const clickedLayer = this.id;
      // e.preventDefault();
      e.stopPropagation();

      const visibility = map.getLayoutProperty(
        clickedLayer,
        'visibility'
      );

      // toggle layer visibility by changing the layout object's visibility property
      if (visibility === 'visible') {
        map.setLayoutProperty(
          clickedLayer,
          'visibility',
          'none');
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

    // add cooked items to menu
    const layers = document.getElementById('level-menu');
    layers.appendChild(label);
    layers.appendChild(link);

    // when a click event occurs on a feature in the layer, open a popup at the
    // location of the feature, with its properties
    for (const id of toggleableLayerIds) {
      map.on('click', id, (e) => {
        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML('<p>level: ' + e.features[0].properties.level + '</p><p>height: ' + e.features[0].properties.height + '</p>')
          .addTo(map);
      });
    };
  }
});
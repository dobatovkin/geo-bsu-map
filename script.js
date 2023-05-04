// eslint-disable-next-line no-undef
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFiYXRvdWtpbiIsImEiOiJjbGc0NWc1NWQwYnh6M3RxZWJpNmV2azBiIn0.ea4gLzFvVXOv9ttQR_7GaQ';

// eslint-disable-next-line no-undef
const map = new mapboxgl.Map({
  container: 'map', // container ID
  style: 'mapbox://styles/dabatoukin/clgzr3dt200bs01qtgo751g7u', // style URL
  center: [27.54875, 53.89310], // starting pos[lng, lat]
  zoom: 19, // starting zoom
  pitch: 45,
  bearing: 110,
  antialias: true,
});

// ! list of interactive exstrusion layers to add
const toggleableLayers = [{
  id: 'geo-1',
  name: '1 этаж',
  data: 'geo-level-1.geojson',
  visibility: 'none',
},
{
  id: 'geo-2',
  name: '2 этаж',
  data: 'geo-level-2.geojson',
  visibility: 'none',
},
{
  id: 'geo-3',
  name: '3 этаж',
  data: 'geo-level-3.geojson',
  visibility: 'none',
},
{
  id: 'geo-outside',
  name: 'снаружи',
  data: 'geo-level-3.geojson',
  visibility: 'visible',
}];

map.on('load', () => { // execute after map has finished loading
  for (const layer of toggleableLayers){
    map.addSource(layer.id+'-src', {
      type: 'geojson',
      data: layer.data,
    });
    map.addLayer({
      id: layer.id,
      type: 'fill-extrusion',
      source: layer.id+'-src',
      layout: {
        visibility: layer.visibility,
      },
      paint: {
        // get the extrusion parameters from the source properties
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base_height'],
        'fill-extrusion-opacity': 1,
      },
    });
  };
});

// after the last frame rendered before the map enters an "idle" state
map.on('idle', () => {
  // if these layers were not added to the map, abort
  let ready = true
  for (const layer of toggleableLayers) {
    if (!map.getLayer(layer.id)) {
      ready = false;
    };
  };
  if (ready === false) {
    return;
  };

  for (const layer of toggleableLayers) {
    // skip layers that already have a button set up.
    if (document.getElementById(layer.id)) {
      continue;
    }

    // create a checkbox w/ event
    const link = document.createElement('input');
    link.id = layer.id;
    link.type = 'checkbox';
    link.className = 'active';

    const initialVisibility = map.getLayoutProperty(
      layer.id,
      'visibility'
    );

    // set check if layer is visible initially
    if (initialVisibility === 'visible') {
      link.checked = true;
    }

    const label = document.createElement('label');
    label.htmlFor = layer.id;
    label.textContent = layer.name;

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
    map.on('click', layer.id, (e) => {
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML('<p>level: ' + e.features[0].properties.level + '</p><p>height: ' + e.features[0].properties.height + '</p>')
        .addTo(map);
    });
  }
});
/* global mapboxgl */
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFiYXRvdWtpbiIsImEiOiJjbGc0NWc1NWQwYnh6M3RxZWJpNmV2azBiIn0.ea4gLzFvVXOv9ttQR_7GaQ';

const map = new mapboxgl.Map(
  {
    container: 'map', // container ID
    style: 'mapbox://styles/dabatoukin/clgzr3dt200bs01qtgo751g7u', // style URL
    center: [27.54875, 53.89310], // starting pos[lng, lat]
    zoom: 18.5, // starting zoom
    pitch: 60,
    bearing: 110,
    antialias: true,
  },
);

const modelOrigin = [27.54875, 53.89310];
const modelAltitude = 0;
const modelRotate = [Math.PI / 2, 0, 0];
const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
  modelOrigin,
  modelAltitude,
);

const modelTransform = {
  translateX: modelAsMercatorCoordinate.x,
  translateY: modelAsMercatorCoordinate.y,
  translateZ: modelAsMercatorCoordinate.z,
  rotateX: modelRotate[0],
  rotateY: modelRotate[1],
  rotateZ: modelRotate[2],
  scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
};

const { THREE } = window;

const customLayer = {
  id: 'geo-outside',
  type: 'custom',
  renderingMode: '3d',
  // eslint-disable-next-line no-shadow
  onAdd(map, gl) {
    this.camera = new THREE.Camera();
    this.scene = new THREE.Scene();
    // create three.js light to illuminate the model
    const ambientLight = new THREE.AmbientLight(0x404040, 90);
    this.scene.add(ambientLight);
    // const directionalLight2 = new THREE.DirectionalLight(0xffffff);
    // directionalLight2.position.set(0, 70, 100).normalize();
    // this.scene.add(directionalLight2);

    // use the three.js GLTF loader to add the 3D model to the three.js scene
    const loader = new THREE.GLTFLoader();
    loader.load(
      'geo-outside.gltf',
      (gltf) => {
        this.scene.add(gltf.scene);
      },
    );
    this.map = map;
    // use the Mapbox GL JS map canvas for three.js
    this.renderer = new THREE.WebGLRenderer({
      canvas: map.getCanvas(),
      context: gl,
      antialias: true,
    });
    this.renderer.autoClear = false;
  },
  render(gl, matrix) {
    const rotationX = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(1, 0, 0),
      modelTransform.rotateX,
    );
    const rotationY = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 1, 0),
      modelTransform.rotateY,
    );
    const rotationZ = new THREE.Matrix4().makeRotationAxis(
      new THREE.Vector3(0, 0, 1),
      modelTransform.rotateZ,
    );
    const m = new THREE.Matrix4().fromArray(matrix);
    const l = new THREE.Matrix4()
      .makeTranslation(
        modelTransform.translateX,
        modelTransform.translateY,
        modelTransform.translateZ,
      )
      .scale(
        new THREE.Vector3(
          modelTransform.scale,
          -modelTransform.scale,
          modelTransform.scale,
        ),
      )
      .multiply(rotationX)
      .multiply(rotationY)
      .multiply(rotationZ);
    this.camera.projectionMatrix = m.multiply(l);
    this.renderer.resetState();
    this.renderer.render(this.scene, this.camera);
    this.map.triggerRepaint();
  },
};

map.on('style.load', () => {
  map.addLayer(customLayer, 'waterway-label');
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
}];

map.on('load', () => { // execute after map has finished loading
  function addExtrusion(layerArr) {
    map.addSource(`${layerArr.id}-src`, {
      type: 'geojson',
      data: layerArr.data,
    });
    map.addLayer({
      id: layerArr.id,
      type: 'fill-extrusion',
      source: `${layerArr.id}-src`,
      layout: {
        visibility: layerArr.visibility,
      },
      paint: {
        // get the extrusion parameters from the source properties
        'fill-extrusion-color': ['get', 'color'],
        'fill-extrusion-height': ['get', 'height'],
        'fill-extrusion-base': ['get', 'base_height'],
        'fill-extrusion-opacity': 1,
      },
    });
  }
  toggleableLayers.forEach(addExtrusion);
  toggleableLayers.push({
    id: 'geo-outside',
    name: 'снаружи',
    data: 'null',
    visibility: 'visible',
  });
});

// after the last frame rendered before the map enters an "idle" state
map.on('idle', () => {
  toggleableLayers.forEach((layer) => {
    // skip layers that already have a button set up.
    if (document.getElementById(layer.id)) {
      return;
    }

    // create a checkbox w/ event
    const link = document.createElement('input');
    link.id = layer.id;
    link.type = 'checkbox';
    link.className = 'active';

    const initialVisibility = map.getLayoutProperty(
      layer.id,
      'visibility',
    );

    // set check if layer is visible initially
    if (initialVisibility === 'visible') {
      link.checked = 'checked';
    }

    const label = document.createElement('label');
    label.htmlFor = layer.id;
    label.textContent = layer.name;

    // show or hide layer when the toggle is clicked
    link.onclick = function stopClickPropagation(e) {
      const clickedLayer = this.id;
      // e.preventDefault();
      e.stopPropagation();

      const visibility = map.getLayoutProperty(
        clickedLayer,
        'visibility',
      );

      // toggle layer visibility by changing the layout object's visibility property
      if (visibility === 'visible') {
        map.setLayoutProperty(
          clickedLayer,
          'visibility',
          'none',
        );
        this.className = '';
      } else {
        this.className = 'active';
        map.setLayoutProperty(
          clickedLayer,
          'visibility',
          'visible',
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
      const parseProperties = e.features[0].properties;
      new mapboxgl.Popup()
        .setLngLat(e.lngLat)
        .setHTML(
          `<h3>${parseProperties.name}</h3>
          <p>Кабинет №${parseProperties.number}</p>
          <p>Атрибуты дебага:${JSON.stringify(parseProperties)}</p>
          <a href="pano/${parseProperties.number}">Панорама</a>`,
        )
        .addTo(map);
    });
  });
});

document.getElementById('home-btn').addEventListener('click', () => {
  // fly to home location
  map.flyTo({
    center: [27.54875, 53.89310],
    zoom: 18.5, // starting zoom
    pitch: 60,
    bearing: 110,
    essential: true,
  });
});

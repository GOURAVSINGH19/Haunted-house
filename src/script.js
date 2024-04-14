import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "lil-gui";
/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// fog
const fog = new THREE.Fog("#262837", 2, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const doorcolor = textureLoader.load("./textures/door/color.jpg");
const doorambient = textureLoader.load("./textures/door/ambientOcclusion.jpg");
const doormetalness = textureLoader.load("./textures/door/metalness.jpg");
const dooralpha = textureLoader.load("./textures/door/alpha.jpg");
const doorroughtness = textureLoader.load("./textures/door/roughness.jpg");
const doornormal = textureLoader.load("./textures/door/normal.jpg");
const doorheight = textureLoader.load("./textures/door/height.jpg");

const grasstexture = textureLoader.load("./textures/grass/color.jpg");
const grassambient = textureLoader.load("./textures/grass/ambientOcclusion.jpg");
const grassroughness = textureLoader.load("./textures/grass/roughness.jpg");
const grassnormal = textureLoader.load("./textures/grass/normal.jpg");

grasstexture.repeat.set(8,8)
grassambient.repeat.set(8,8)
grassroughness.repeat.set(8,8)
grassnormal.repeat.set(8,8)

// texture cannot repeat itself so we use repeatwrapping
grasstexture.wrapS = THREE.RepeatWrapping;
grassambient.wrapS = THREE.RepeatWrapping;
grassroughness.wrapS = THREE.RepeatWrapping;
grassnormal.wrapS = THREE.RepeatWrapping;

grasstexture.wrapT = THREE.RepeatWrapping;
grassambient.wrapT = THREE.RepeatWrapping;
grassroughness.wrapT = THREE.RepeatWrapping;
grassnormal.wrapT = THREE.RepeatWrapping;

// texture cannot repeat itself so we use repeatwrapping

const bricktexture = textureLoader.load("./textures/bricks/color.jpg");
const brickambient = textureLoader.load("./textures/bricks/ambientOcclusion.jpg");
const brickroughness = textureLoader.load("./textures/bricks/roughness.jpg");
const bricknormal = textureLoader.load("./textures/bricks/normal.jpg");

/**
 * House
 */

// create group its like a function
const house = new THREE.Group();
scene.add(house);

// walls geometry
const walls = new THREE.Mesh(
  new THREE.BoxBufferGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ map: bricktexture, aoMap: brickambient , normalMap : bricknormal , roughnessMap : brickroughness  })
);

walls.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
  );
walls.position.y = 1.25;
house.add(walls);

// roof geometry
const roof = new THREE.Mesh(
  new THREE.ConeBufferGeometry(3.5, 1, 4),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.position.y = 2.5 + 0.5;
roof.rotation.y = Math.PI * 0.25;

house.add(roof);

// creating door geometry

const door = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorcolor,
    side: THREE.DoubleSide,
    alphaMap: dooralpha,
    transparent: true,
    aoMap: doorambient,
    displacementMap: doorheight,
    displacementScale: 0.1,
    metalnessMap: doormetalness,
    roughnessMap: doorroughtness,
    normalMap: doornormal,
  })
);

// use for support aomap
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = 2 + 0.01;

house.add(door);

// bushes geometry
const bushgeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89cB54" });
const bush1 = new THREE.Mesh(bushgeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(1, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushgeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.5, 0.1, 2.5);

const bush3 = new THREE.Mesh(bushgeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.9, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushgeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1.2, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

//graves

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });

for (let i = 0; i < 60; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 4 + Math.random() * 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  //create the mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  //position
  grave.position.set(x, 0.4, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow =true
  graves.add(grave);
}

// Temporary sphere
// const sphere = new THREE.Mesh(
//     new THREE.SphereGeometry(1, 32, 32),
//     new THREE.MeshStandardMaterial({ roughness: 0.7 })
// )
// sphere.position.y = 1
// scene.add(sphere)

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ map:grasstexture , roughnessMap:grassroughness, normalMap : grassnormal , aoMap : grassambient , side: THREE.DoubleSide })
);

floor.receiveShadow  = true;

floor.geometry.setAttribute(
    "uv2",
    new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
  );
floor.rotation.x = - Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
// gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001)
scene.add(ambientLight);


// Directional light
const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
// gui.add(moonLight, 'intensity').min(0).max(1).step(0.001)
// gui.add(moonLight.position, 'x').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'y').min(- 5).max(5).step(0.001)
// gui.add(moonLight.position, 'z').min(- 5).max(5).step(0.001)
scene.add(moonLight);

//door light

const doorlight = new THREE.PointLight("#b07878", 1.5, 5, 1.9);
doorlight.position.set(0, 2.2, 2.7);
house.add(doorlight);



//ghost

const ghost1 = new THREE.PointLight("#ff00ff",2,3)
gui.addColor(ghost1,"color")
scene.add(ghost1)
const ghost2 = new THREE.PointLight("#00ffff",2,3)
scene.add(ghost2)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor("#262837");

// shadow
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorlight.castShadow = true;

ghost1.castShadow = true;
ghost2.castShadow = true;

walls.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;


doorlight.shadow.mapSize.width = 256
doorlight.shadow.mapSize.height = 256
doorlight.shadow.camera.far = 7



/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  //ghots
  const ghostAngle = elapsedTime * 0.5
  ghost1.position.x = Math.cos(ghostAngle) * 4;
  ghost1.position.z = Math.sin(ghostAngle) * 4;
  ghost1.position.y = Math.sin(elapsedTime) * 3;


  const ghost2Angle = - elapsedTime * 0.32
  ghost2.position.x = Math.cos(ghost2Angle) * 4;
  ghost2.position.z = Math.sin(ghost2Angle) * 4;
  ghost2.position.y = Math.sin(elapsedTime) * 3 + Math.sin(elapsedTime) *2.5;


  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

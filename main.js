import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';





// Setup

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// create a new renderer by instating the canvas element in our HTML // file
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.render(scene, camera);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(20);
camera.position.setX(20);
camera.position.setY(10);




// Donut

const donutTexture = new THREE.TextureLoader().load('images/donut.jpg');
const donutGeometry = new THREE.TorusGeometry(3, 1.5, 16, 100);
const donutMaterial = new THREE.MeshBasicMaterial({ map: donutTexture });
const torus = new THREE.Mesh(donutGeometry, donutMaterial);
scene.add(torus);

torus.position.z = 12;
torus.position.x = 5;
torus.position.y = 7;



// Diamond

const diamondGeometry = new THREE.IcosahedronGeometry(1.9, 0);
diamondGeometry.scale(1, 1.8, 1);
const normalTexture = new THREE.TextureLoader().load('images/normalmap.png');

const diamondMaterial = new THREE.MeshStandardMaterial({
    normalMap: normalTexture,
    color: 0xFF69B4,
    roughness: 0.11,
    metalness: 0.3,
    clearcoat: 4.0,
    clearcoatRoughness: 0.2
});

const diamond = new THREE.Mesh(diamondGeometry, diamondMaterial);
scene.add(diamond);

diamond.position.z = 4;
diamond.position.x = torus.position.x + 8;
diamond.position.y = 2;






// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(10,20, 10);
scene.add(pointLight);


const ambientLight = new THREE.AmbientLight(0xffffff);
ambientLight.position.set(25, -15, -400);
scene.add(ambientLight);

// Helper
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper)



// Background
const spaceTexture = new THREE.TextureLoader().load('images/background.png')
scene.background = spaceTexture;

const controls = new OrbitControls(camera, renderer.domElement)


function animate() {
    requestAnimationFrame( animate );
    // slowly rotate the cube:
    torus.rotation.x += 0.01;
    torus.rotation.y += 0.01;
    diamond.rotation.x += 0.01;
    diamond.rotation.y += 0.01;
    // rotate the icosahedron a little faster in the opposite direction:

    // ALLOWS YOUR ORBIT CONTROLS TO UPDATE LIVE IN REAL-TIME:
    controls.update()


    renderer.render( scene, camera );
}


animate();









// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from '../counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vite.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `

// setupCounter(document.querySelector('#counter'))






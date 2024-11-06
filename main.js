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

// Object texture mapping

const texture = new THREE.TextureLoader().load('images/donut.jpg')
const geometry = new THREE.TorusGeometry(6, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({map: texture });
const torus = new THREE.Mesh(geometry, material);
scene.add(torus);


torus.position.z = 3;
torus.position.x = 3;

torus.rotation.x += 0.01;  // Small incremental rotation along x-axis
torus.rotation.y += 0.01;  // Small incremental rotation along y-axis



// Lights

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(0, -10, 10);
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




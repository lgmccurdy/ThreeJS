import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.fov = 10; // Default is 75, try values lower than 75 for zoom-in effect
camera.updateProjectionMatrix(); // Update the camera's projection matrix after changing the FOV



// Create a new renderer by instantiating the canvas element in our HTML file
const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});

renderer.render(scene, camera);

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMappingExposure = 2;
renderer.outputEncoding = THREE.sRGBEncoding;
camera.position.set(40, 40, 100); // Positioned above the pudding at (x=0, y=10, z=0)


const ambientLight = new THREE.AmbientLight( 0xffffff, 0.4 );
scene.add( ambientLight );

const pointLight = new THREE.PointLight( 0xffffff, 0.6 );
camera.add( pointLight );
scene.add( camera );


const loader = new GLTFLoader();

loader.load( 'models/macaron.glb', function ( gltf ) {

    scene.add( gltf.scene );
    gltf.scene.position.set(-8, -.7, 0);
    gltf.scene.scale.set(1.3, 1.3, 1.3);


}, undefined, function ( error ) {

    console.error( error );


} );
loader.load( 'models/donut.glb', function ( gltf ) {

    scene.add( gltf.scene );
    gltf.scene.position.set(8, -.8, 0);
    gltf.scene.scale.set(1.5, 1.5, 1.5);

}, undefined, function ( error ) {

    console.error( error );


} );
loader.load( 'models/cupcake.glb', function ( gltf ) {

    scene.add( gltf.scene );
    gltf.scene.position.set(0, -1.5, 8);
    gltf.scene.scale.set(1.5, 1.5, 1.5);

}, undefined, function ( error ) {

    console.error( error );


} );
loader.load( 'models/pudding.glb', function ( gltf ) {

    scene.add( gltf.scene );
    gltf.scene.position.set(0, -1.7, -8);
    gltf.scene.scale.set(2, 2, 2);

}, undefined, function ( error ) {

    console.error( error );


} );
loader.load( 'models/platter.glb', function ( gltf ) {

    scene.add( gltf.scene );
    gltf.scene.position.set(0, -2, 0);
    gltf.scene.scale.set(3, 1, 3);

}, undefined, function ( error ) {

    console.error( error );


} );



// Background
const spaceTexture = new THREE.TextureLoader().load('images/background.png');
scene.background = spaceTexture;

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);


    // Update the OrbitControls
    controls.update();

    // Render the scene
    renderer.render(scene, camera);
}

animate();









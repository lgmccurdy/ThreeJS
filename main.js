import * as THREE from 'https://cdn.skypack.dev/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/loaders/GLTFLoader.js';

// Setup
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.fov = 10;
camera.updateProjectionMatrix();

const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMappingExposure = 2;
renderer.outputEncoding = THREE.sRGBEncoding;

camera.position.set(40, 40, 100);
renderer.render(scene, camera);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.6);
camera.add(pointLight);
scene.add(camera);

const loader = new GLTFLoader();

const desserts = [];

function loadDessert(path, position, scale, isInteractive = true) {
    loader.load(
        path,
        (gltf) => {
            const dessert = gltf.scene;
            dessert.position.set(...position);
            dessert.scale.set(...scale);


            dessert.userData.isInteractive = isInteractive;

            dessert.traverse((child) => {
                if (child.isMesh) {
                    child.userData.parentDessert = dessert;
                }
            });

            scene.add(dessert);
            desserts.push(dessert);
        },
        undefined,
        (error) => console.error(error)
    );
}

// Load desserts
loadDessert('models/macaron.glb', [-8, -0.7, 0], [1.3, 1.3, 1.3]);
loadDessert('models/donut.glb', [8, -0.8, 0], [1.5, 1.5, 1.5]);
loadDessert('models/cupcake.glb', [0, -1.5, 8], [1.5, 1.5, 1.5]);
loadDessert('models/pudding.glb', [0, -1.7, -8], [2, 2, 2]);
loadDessert('models/platter.glb', [0, -2, 0], [3, 1, 3], false); // Exclude platter from hover detection


// Background
const spaceTexture = new THREE.TextureLoader().load('images/background.png');
scene.background = spaceTexture;

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);


const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();


window.addEventListener('mousemove', (event) => {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

function animate() {
    requestAnimationFrame(animate);


    raycaster.setFromCamera(mouse, camera);


    const intersects = raycaster.intersectObjects(
        desserts.filter(dessert => dessert.userData.isInteractive), true
    );


    desserts.forEach((dessert) => {
        dessert.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive.setHex(0x000000);
            }
        });
    });


    if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object;
        const parentDessert = hoveredMesh.userData.parentDessert;

        if (parentDessert) {
            parentDessert.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive.setHex(0xff69b4);
                    child.material.emissiveIntensity = 0.4;

                }
            });
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

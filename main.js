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

camera.position.set(80, 40, 110);
renderer.render(scene, camera);

// Add window resize handler
function onWindowResize() {
    // Update camera aspect ratio
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Resize renderer
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Adjust description overlay positioning
    const descriptionOverlay = document.getElementById('dessert-description');
    if (descriptionOverlay) {
        descriptionOverlay.style.bottom = '7%';
        descriptionOverlay.style.left = '50%';
        descriptionOverlay.style.transform = 'translateX(-50%)';
    }
}

// Add event listener for window resize
window.addEventListener('resize', onWindowResize);

//Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.6);
camera.add(pointLight);
scene.add(camera);

//Loader & config of desserts
const loader = new GLTFLoader();
const desserts = [];
let platter = null;
let lastClickedDessert = null;

// Dessert descriptions
const dessertDescriptions = {
    macaron: {
        name: "Macaron",
        description: "A sweet, colorful French cookie made with almond flour, sugar, and egg whites. It has a crispy outside, a chewy inside, and is filled with tasty flavors like chocolate, vanilla, or fruit."
    },
    donut: {
        name: "Donut",
        description: "A fried or baked sweet treat, typically round with a hole in the center or filled with sweet fillings. It has a soft, fluffy texture and is often topped with icing, glaze, or sprinkles."
    },
    cupcake: {
        name: "Cupcake",
        description: "A cupcake is a small, sweet cake baked in a cup-shaped container. It has a soft, fluffy texture and is usually topped with frosting and sprinkles."
    },
    pudding: {
        name: "Custard Pudding",
        description: "A smooth, creamy dessert made with eggs, milk, sugar, and vanilla. It's baked or steamed until set, served chilled, and often topped with caramel or fruit."
    }
};

// Dessert positions on platter
const dessertConfig = {
    macaron: {
        position: [-8, 1.1, 0],
        rotation: Math.PI / 1.42,
        scale: [1.3, 1.3, 1.3]
    },
    donut: {
        position: [8, 1, 0],
        rotation: (2 * Math.PI) / 1.17,
        scale: [1.5, 1.5, 1.5]
    },
    cupcake: {
        position: [0, 0.1, 8],
        rotation: Math.PI / 5,
        scale: [1.5, 1.5, 1.5]
    },
    pudding: {
        position: [0, 0.5, -8],
        rotation: Math.PI / 0.83,
        scale: [2, 2, 2]
    }
};

// Dessert description overlay
function createDescriptionOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'dessert-description';
    overlay.style.position = 'fixed';
    overlay.style.bottom = '7%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    overlay.style.padding = '15px';
    overlay.style.borderRadius = '10px';
    overlay.style.border = '3px solid #48260DFF';
    overlay.style.maxWidth = '90%';
    overlay.style.width = 'max-content';
    overlay.style.textAlign = 'center';
    overlay.style.display = 'none';
    overlay.style.zIndex = '1000';

    // Make text responsive
    overlay.style.fontSize = 'clamp(14px, 3vw, 24px)';

    const nameElement = document.createElement('h2');
    nameElement.id = 'dessert-name';
    nameElement.style.margin = '0 0 10px 0';
    nameElement.style.color = '#48260DFF';
    nameElement.style.fontFamily = "'Dessert Script', sans-serif";
    nameElement.style.fontSize = 'clamp(24px, 5vw, 32px)';

    const descriptionElement = document.createElement('p');
    descriptionElement.id = 'dessert-description-text';
    descriptionElement.style.margin = '0';
    descriptionElement.style.color = '#48260DFF';
    descriptionElement.style.fontFamily = "'Dessert Script', sans-serif";

    overlay.appendChild(nameElement);
    overlay.appendChild(descriptionElement);
    document.body.appendChild(overlay);


    function adjustOverlaySize() {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;


        overlay.style.padding = viewportWidth < 600 ? '10px' : '15px';
        overlay.style.maxWidth = viewportWidth < 600 ? '95%' : '90%';
    }

    window.addEventListener('resize', adjustOverlaySize);
    adjustOverlaySize(); 

    return overlay;
}

const descriptionOverlay = createDescriptionOverlay();

function showDessertDescription(dessertName) {
    const description = dessertDescriptions[dessertName];
    if (description) {
        document.getElementById('dessert-name').textContent = description.name;
        document.getElementById('dessert-description-text').textContent = description.description;
        descriptionOverlay.style.display = 'block';
    }
}

function hideDescriptionOverlay() {
    descriptionOverlay.style.display = 'none';
}

//Load dessert and platter
function loadDessert(name, path, config, isInteractive = true) {
    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                const dessert = gltf.scene;
                dessert.position.set(...config.position);
                dessert.scale.set(...config.scale);

                dessert.userData.isInteractive = isInteractive;
                dessert.userData.name = name;
                dessert.userData.originalPosition = new THREE.Vector3(...config.position);
                dessert.userData.originalRotation = config.rotation;

                dessert.traverse((child) => {
                    if (child.isMesh) {
                        child.userData.parentDessert = dessert;
                    }
                });

                scene.add(dessert);

                if (isInteractive) {
                    desserts.push(dessert);
                } else {
                    platter = dessert;
                }

                resolve(dessert);
            },
            undefined,
            (error) => {
                console.error(error);
                reject(error);
            }
        );
    });
}

Promise.all([
    loadDessert('macaron', 'models/macaron.glb', dessertConfig.macaron),
    loadDessert('donut', 'models/donut.glb', dessertConfig.donut),
    loadDessert('cupcake', 'models/cupcake.glb', dessertConfig.cupcake),
    loadDessert('pudding', 'models/pudding.glb', dessertConfig.pudding),
    loadDessert('platter', 'models/platter.glb', {
        position: [0, 0, 0],
        rotation: 0,
        scale: [3, 1, 3]
    }, false)
]).then(() => {

});

// Background
scene.background = new THREE.Color('#FFF5EE');

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;
controls.update();

// Raycasting for click and hover
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

let currentRotationAnimation = null;

// Mouse move events
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Click events
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    // Perform intersection (hover) only with desserts
    const intersects = raycaster.intersectObjects(
        desserts.filter(dessert => dessert.userData.isInteractive), true
    );

    // If dessert is clicked
    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const parentDessert = clickedMesh.userData.parentDessert;

        if (parentDessert && platter) {
            // Cancel any ongoing rotation animation
            if (currentRotationAnimation) {
                cancelAnimationFrame(currentRotationAnimation);
            }

            // Show description for the clicked dessert
            showDessertDescription(parentDessert.userData.name);
            lastClickedDessert = parentDessert.userData.name;

            // Animate rotation
            function rotateToCamera() {
                const rotationSpeed = 0.1;
                const currentRotation = platter.rotation.y;

                let targetRotation = parentDessert.userData.originalRotation % (2 * Math.PI);
                let currentNormalized = currentRotation % (2 * Math.PI);

                if (currentNormalized < 0) currentNormalized += 2 * Math.PI;
                if (targetRotation < 0) targetRotation += 2 * Math.PI;

                let angleDifference = targetRotation - currentNormalized;

                // Shortest rotation
                if (Math.abs(angleDifference) > Math.PI) {
                    if (angleDifference > 0) {
                        angleDifference -= 2 * Math.PI;
                    } else {
                        angleDifference += 2 * Math.PI;
                    }
                }

                // Smooth rotation
                if (Math.abs(angleDifference) > 0.01) {
                    platter.rotation.y += angleDifference * rotationSpeed;

                    // Move desserts with the platter
                    desserts.forEach(dessert => {
                        const localPos = dessert.userData.originalPosition.clone();
                        localPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), platter.rotation.y);
                        dessert.position.copy(localPos);
                    });

                    currentRotationAnimation = requestAnimationFrame(rotateToCamera);
                } else {
                    platter.rotation.y = targetRotation;
                    desserts.forEach(dessert => {
                        const localPos = dessert.userData.originalPosition.clone();
                        localPos.applyAxisAngle(new THREE.Vector3(0, 1, 0), platter.rotation.y);
                        dessert.position.copy(localPos);
                    });
                }
            }

            rotateToCamera();
        }
    } else {
        // Keep the last clicked dessert's description visible if clicked outside of desserts
        if (lastClickedDessert) {
            showDessertDescription(lastClickedDessert);
        }
    }
});

function animate() {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);

    // Interact with desserts only
    const intersects = raycaster.intersectObjects(
        desserts.filter(dessert => dessert.userData.isInteractive), true
    );

    // Original color reset for desserts
    desserts.forEach((dessert) => {
        dessert.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive.setHex(0x000000); // No emissive effect by default
            }
        });
    });

    // Color change with hover
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
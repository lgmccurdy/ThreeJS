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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 0.6);
camera.add(pointLight);
scene.add(camera);

const loader = new GLTFLoader();

const desserts = []; // Store dessert meshes for hover effect
let platter = null; // Store platter reference
let lastClickedDessert = null; // Track the last clicked dessert

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

// Predefined rotation angles and initial positions
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

// Create description overlay
function createDescriptionOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'dessert-description';
    overlay.style.position = 'absolute';
    overlay.style.bottom = '7%';
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';
    overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    overlay.style.padding = '15px';
    overlay.style.borderRadius = '10px';
    overlay.style.border = '3px solid #48260DFF';
    overlay.style.maxWidth = '1500px';
    overlay.style.textAlign = 'center';
    overlay.style.display = 'none';
    overlay.style.zIndex = '1000';

    const nameElement = document.createElement('h2');
    nameElement.id = 'dessert-name';
    nameElement.style.margin = '0 0 10px 0';
    nameElement.style.color = '#48260DFF';
    nameElement.style.fontFamily = "'Dessert Script', sans-serif"; // Dynamically set the font
    nameElement.style.fontSize = '32px'; // Adjust this value to make it bigger


    const descriptionElement = document.createElement('p');
    descriptionElement.id = 'dessert-description-text';
    descriptionElement.style.margin = '0';
    descriptionElement.style.color = '#48260DFF';
    descriptionElement.style.fontFamily ="'Dessert Script', sans-serif"; // Dynamically set the font

    overlay.appendChild(nameElement);
    overlay.appendChild(descriptionElement);
    document.body.appendChild(overlay);

    return overlay;
}
// Create static text overlay at the top
function createStaticText() {
    const staticText = document.createElement('div');
    staticText.id = 'static-text';
    staticText.style.position = 'fixed';
    staticText.style.top = '50px';
    staticText.style.left = '50%';
    staticText.style.transform = 'translateX(-50%)';
    staticText.style.padding = '10px 20px';
    staticText.style.borderRadius = '5px';
    staticText.style.color = '#48260DFF';
    staticText.style.fontFamily = "'Dessert Script', sans-serif";
    staticText.style.fontSize = '20px';
    staticText.style.textAlign = 'center';
    staticText.style.zIndex = '1000';
    staticText.textContent = "Click a dessert to rotate the platter and learn more!";

    document.body.appendChild(staticText);
}

const descriptionOverlay = createDescriptionOverlay();
createStaticText();

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

function loadDessert(name, path, config, isInteractive = true) {
    return new Promise((resolve, reject) => {
        loader.load(
            path,
            (gltf) => {
                const dessert = gltf.scene;
                dessert.position.set(...config.position);
                dessert.scale.set(...config.scale);

                // Mark metadata
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

// Load desserts and platter
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
    // Initial setup complete
});

// Background
scene.background = new THREE.Color('#FFF5EE'); // Set background to the desired color


// OrbitControls - Disabling user interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableRotate = false; // Disable rotation
controls.enableZoom = false;   // Disable zoom
controls.enablePan = false;    // Disable panning
controls.update();

// Raycaster for hover and click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Track current animation state
let currentRotationAnimation = null;

// Listen for mouse move events
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Listen for click events
window.addEventListener('click', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Perform intersection only with interactive desserts
    const intersects = raycaster.intersectObjects(
        desserts.filter(dessert => dessert.userData.isInteractive), true
    );

    // If a dessert is clicked
    if (intersects.length > 0) {
        const clickedMesh = intersects[0].object;
        const parentDessert = clickedMesh.userData.parentDessert;

        if (parentDessert && platter) {
            // Cancel any ongoing rotation animation
            if (currentRotationAnimation) {
                cancelAnimationFrame(currentRotationAnimation);
            }

            // Get the rotation for the clicked dessert
            const targetRotation = parentDessert.userData.originalRotation;

            // Show description for the clicked dessert
            showDessertDescription(parentDessert.userData.name);
            lastClickedDessert = parentDessert.userData.name;

            // Animate rotation
            function rotateToCamera() {
                const rotationSpeed = 0.1;
                const currentRotation = platter.rotation.y;

                // Normalize target rotation to be within [0, 2π]
                let targetRotation = parentDessert.userData.originalRotation % (2 * Math.PI);
                let currentNormalized = currentRotation % (2 * Math.PI);

                // Adjust current rotation to be in the same range as target
                if (currentNormalized < 0) currentNormalized += 2 * Math.PI;
                if (targetRotation < 0) targetRotation += 2 * Math.PI;

                // Calculate the shortest rotation path
                let angleDifference = targetRotation - currentNormalized;

                // Adjust for shortest rotation
                if (Math.abs(angleDifference) > Math.PI) {
                    if (angleDifference > 0) {
                        angleDifference -= 2 * Math.PI;
                    } else {
                        angleDifference += 2 * Math.PI;
                    }
                }

                // Smoothly interpolate rotation
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
                    // Ensure final precise position
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
        // If clicked outside of desserts, keep the last clicked dessert's description visible
        if (lastClickedDessert) {
            showDessertDescription(lastClickedDessert);
        }
    }
});

function animate() {
    requestAnimationFrame(animate);

    // Update the raycaster
    raycaster.setFromCamera(mouse, camera);

    // Perform intersection only with interactive desserts
    const intersects = raycaster.intersectObjects(
        desserts.filter(dessert => dessert.userData.isInteractive), true
    );

    // Reset all desserts to their original emissive color
    desserts.forEach((dessert) => {
        dessert.traverse((child) => {
            if (child.isMesh) {
                child.material.emissive.setHex(0x000000); // No emissive effect by default
            }
        });
    });

    // Change emissive color of the intersected dessert
    if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object;
        const parentDessert = hoveredMesh.userData.parentDessert; // Get parent dessert

        if (parentDessert) {
            parentDessert.traverse((child) => {
                if (child.isMesh) {
                    child.material.emissive.setHex(0xff69b4); // Red emissive effect
                    child.material.emissiveIntensity = 0.4; // Adjust intensity for a subtler effect
                }
            });
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

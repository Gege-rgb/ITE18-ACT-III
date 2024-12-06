import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();

// Galaxy parameters
const starCount = 5000; // Number of stars in the galaxy
const arms = 5; // Number of spiral arms
const radius = 20; // Radius of the galaxy
const coreCount = 1000; // Number of stars in the core
const starColor = new THREE.Color(0x6a0dad); // Purple color for stars

// Geometry and material for the galaxy's stars
const positionsArray = new Float32Array(starCount * 3);
const coreArray = new Float32Array(coreCount * 3);

// Create spherical galaxy shape for stars (using spherical coordinates)
for (let i = 0; i < starCount; i++) {
  // Random spherical coordinates
  const radiusFactor = Math.pow(Math.random(), 1.2) * radius; // A little uneven distribution for more realistic effect
  const phi = Math.random() * Math.PI * 2; // Azimuthal angle (longitude)
  const theta = Math.acos(2 * Math.random() - 1); // Polar angle (latitude)

  // Convert spherical to cartesian coordinates
  positionsArray[i * 3] = radiusFactor * Math.sin(theta) * Math.cos(phi);
  positionsArray[i * 3 + 1] = radiusFactor * Math.sin(theta) * Math.sin(phi);
  positionsArray[i * 3 + 2] = radiusFactor * Math.cos(theta);
}

// Create core for galaxy (dense center)
for (let i = 0; i < coreCount; i++) {
  coreArray[i * 3] = (Math.random() - 0.5) * 2;
  coreArray[i * 3 + 1] = (Math.random() - 0.5) * 2;
  coreArray[i * 3 + 2] = (Math.random() - 0.5) * 2;
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionsArray, 3)
);

const coreGeometry = new THREE.BufferGeometry();
coreGeometry.setAttribute("position", new THREE.BufferAttribute(coreArray, 3));

// Material for stars
const starMaterial = new THREE.PointsMaterial({
  color: starColor,
  size: 0.05, // Size of each star
  transparent: true,
  opacity: 0.8,
  sizeAttenuation: true,
});

// Create points for stars and core
const coreMaterial = new THREE.PointsMaterial({
  color: new THREE.Color(0x8a2be2),
  size: 0.1,
  transparent: true,
  opacity: 1,
});

// Create points for stars and core
const stars = new THREE.Points(starGeometry, starMaterial);
const core = new THREE.Points(coreGeometry, coreMaterial);

// Add stars and core to the scene
scene.add(stars);
scene.add(core);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  200
);
camera.position.z = 20;
scene.add(camera);

// Lighting
const ambientLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize();
scene.add(directionalLight);

// Renderer
const canvas = document.querySelector("canvas.webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Orbit controls (to allow camera interaction)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Handle window resizing
window.addEventListener("resize", () => {
  // Update camera
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Shimmer Effect (Twinkle)
const shimmerSpeed = 0.4; // Speed of shimmer effect

// Animate the shimmer
const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate the galaxy
  stars.rotation.y = elapsedTime * 0.05; // Speed of rotation for stars
  core.rotation.y = elapsedTime * 0.1; // Core spins faster

  // Shimmer effect
  const time = Date.now() * shimmerSpeed;
  const starOpacity = Math.abs(Math.sin(time * 0.002)) * 0.8 + 0.2;
  stars.material.opacity = starOpacity;

  // Shimmer effect for core
  const coreOpacity = Math.abs(Math.sin(time * 0.004)) * 0.6 + 0.4;
  core.material.opacity = coreOpacity;

  // Update controls
  controls.update();

  // Render the scene
  renderer.render(scene, camera);

  // Loop animation
  window.requestAnimationFrame(tick);
};

// Start animation loop
const clock = new THREE.Clock();
tick();

// petri.js

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function initPetriScene() {
  const container = document.getElementById('threejs-container');
  if (!container) {
    console.error('Nepavyko rasti "threejs-container" elemento.');
    return;
  }

  container.style.width = '100vw';
  container.style.height = '100vh';

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 7, 10);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(0, 10, 10);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambient);

  const baseGeometry = new THREE.CylinderGeometry(5, 5, 0.2, 64);
  const baseMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.4, 
    side: THREE.DoubleSide 
  });
  const petriBase = new THREE.Mesh(baseGeometry, baseMaterial);
  petriBase.position.y = 0;
  scene.add(petriBase);

  const rimGeometry = new THREE.CylinderGeometry(4.85, 4.85, 1.2, 64, 1, true);
  const rimMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    transparent: true, 
    opacity: 0.3, 
    side: THREE.DoubleSide 
  });
  const petriRim = new THREE.Mesh(rimGeometry, rimMaterial);
  petriRim.position.y = 0.6;
  scene.add(petriRim);

  const agarGeometry = new THREE.CylinderGeometry(4.85, 4.85, 0.3, 64);
  const agarMaterial = new THREE.MeshPhongMaterial({ color: 0xee4455 });
  const agar = new THREE.Mesh(agarGeometry, agarMaterial);
  agar.position.y = 0.25;
  scene.add(agar);

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  return { scene, camera, renderer, controls };
}

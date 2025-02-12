// mod/ecoliplugin/code/bacteria.js

import * as THREE from 'three';
import { BacteriumParams, PetriParams } from './parameters.js';

export let bacteria = [];
export let bacteriaMesh = null;

const { baseLength, cellWidth, cellHeight, divisionThreshold, spacing } = BacteriumParams;
const maxBacs = 20000;

const petriCenter = PetriParams.center;
const petriRadius = PetriParams.radius;

function createBacteriumData(position, angle) {
  return {
    position: position.clone(),
    angle: angle,
    currentLength: baseLength
  };
}

export function initBacteriaMesh(scene) {
  const geometry = new THREE.BoxGeometry(baseLength, cellHeight, cellWidth);
  geometry.translate(baseLength / 2, 0, 0);
  const material = new THREE.MeshStandardMaterial({ color: 0xfffaf0, side: THREE.DoubleSide });
  bacteriaMesh = new THREE.InstancedMesh(geometry, material, maxBacs);
  bacteriaMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  bacteriaMesh.count = 0;
  scene.add(bacteriaMesh);
}

function updateInstancedMesh() {
  const dummy = new THREE.Object3D();
  for (let i = 0; i < bacteria.length; i++) {
    const bac = bacteria[i];
    dummy.position.copy(bac.position);
    dummy.rotation.y = bac.angle;
    dummy.scale.set(bac.currentLength / baseLength, 1, 1);
    dummy.updateMatrix();
    bacteriaMesh.setMatrixAt(i, dummy.matrix);
  }
  bacteriaMesh.count = bacteria.length;
  bacteriaMesh.instanceMatrix.needsUpdate = true;
}

export function addBacterium(scene) {
  if (!bacteriaMesh) {
    initBacteriaMesh(scene);
  }
  const initialData = createBacteriumData(new THREE.Vector3(0, 0.45, 0), 0);
  bacteria.push(initialData);
  updateInstancedMesh();
}

export function growBacteria(growthRate, multiplier, scene) {
  const effectiveGrowth = growthRate * multiplier * 0.1;
  let newBacteria = [];
  for (let i = 0; i < bacteria.length; i++) {
    let bac = bacteria[i];
    bac.currentLength += effectiveGrowth;
    if (bac.currentLength >= divisionThreshold) {
      divideBacterium(bac, newBacteria);
    } else {
      newBacteria.push(bac);
    }
  }
  bacteria = newBacteria;
  updateInstancedMesh();
}

function divideBacterium(parentData, newBacteriaArray) {
  const parentPos = parentData.position.clone();
  const angle = parentData.angle;
  const tipOffset = new THREE.Vector3(parentData.currentLength, 0, 0)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
  const tipPos = parentPos.clone().add(tipOffset);
  if (tipPos.distanceTo(petriCenter) > petriRadius) {
    parentData.currentLength = baseLength;
    newBacteriaArray.push(parentData);
    return;
  }
  const delta = (Math.random() * (Math.PI / 3)) - (Math.PI / 6);
  const daughterAngle1 = angle + delta;
  const daughterAngle2 = angle + delta + Math.PI;
  const offsetVec1 = new THREE.Vector3(spacing, 0, 0)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), daughterAngle1);
  const offsetVec2 = new THREE.Vector3(spacing, 0, 0)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), daughterAngle2);
  const daughterPos1 = tipPos.clone().add(offsetVec1);
  const daughterPos2 = tipPos.clone().add(offsetVec2);
  const daughter1 = createBacteriumData(daughterPos1, daughterAngle1);
  const daughter2 = createBacteriumData(daughterPos2, daughterAngle2);
  newBacteriaArray.push(daughter1, daughter2);
}

export function smoothDivisionForCount(scene, count) {
  if (bacteria.length === 0) return;
  let indices = [];
  for (let i = 0; i < bacteria.length; i++) {
    indices.push(i);
  }
  indices.sort(() => Math.random() - 0.5);
  let selected = new Set(indices.slice(0, Math.min(count, bacteria.length)));
  let newArray = [];
  for (let i = 0; i < bacteria.length; i++) {
    if (selected.has(i)) {
      let daughters = [];
      divideBacterium(bacteria[i], daughters);
      for (let d of daughters) {
        let vec = d.position.clone().sub(petriCenter);
        let radiusFactor = 1.2;
        vec.x += (Math.random() - 0.5) * 0.05;
        vec.z += (Math.random() - 0.5) * 0.05;
        vec.multiplyScalar(radiusFactor);
        if (vec.length() > (petriRadius - 0.1)) {
          vec.setLength(petriRadius - 0.1);
        }
        d.position.copy(petriCenter.clone().add(vec));
      }
      newArray.push(...daughters);
    } else {
      newArray.push(bacteria[i]);
    }
  }
  bacteria = newArray;
  updateInstancedMesh();
}

export function killAllBacteria(scene) {
  // Animacijos trukmė milisekundėmis
  const duration = 1000; // 1 sekundė
  const startTime = performance.now();

  // Saugo pradinę materialo spalvą – jūsų pradinė spalva buvo 0xfffaf0
  const startColor = new THREE.Color(0xfffaf0);
  // Tikslinė spalva: tamsiai žalia (pvz., #004d00)
  const endColor = new THREE.Color(0x004d00);
  
  // Laikinas dummy objektas naudojamas instanciuoto mesh atnaujinimui
  const dummy = new THREE.Object3D();

  function animateKill() {
    const elapsed = performance.now() - startTime;
    // t eina nuo 0 iki 1
    const t = Math.min(elapsed / duration, 1);

    // Atnaujiname kiekvienos bakterijos poziciją: nusikelia žemyn
    for (let i = 0; i < bacteria.length; i++) {
      // Sumažiname y koordinatę, pvz., 0.01 per animacijos frame
      bacteria[i].position.y -= 0.01;
    }
    
    // Linearus spalvos perėjimas: iš pradinės spalvos į tamsiai žalią
    const blendedColor = startColor.clone().lerp(endColor, t);
    if (bacteriaMesh && bacteriaMesh.material) {
      bacteriaMesh.material.color.copy(blendedColor);
    }
    
    // Atnaujiname instanciuoto mesh transformacijas
    for (let i = 0; i < bacteria.length; i++) {
      const bac = bacteria[i];
      dummy.position.copy(bac.position);
      dummy.rotation.y = bac.angle;
      dummy.scale.set(bac.currentLength / BacteriumParams.baseLength, 1, 1);
      dummy.updateMatrix();
      bacteriaMesh.setMatrixAt(i, dummy.matrix);
    }
    bacteriaMesh.instanceMatrix.needsUpdate = true;
    bacteriaMesh.count = bacteria.length;
    
    if (t < 1) {
      requestAnimationFrame(animateKill);
    } else {
      // Animacija baigta – pašaliname visas bakterijas
      bacteria = [];
      bacteriaMesh.count = 0;
      bacteriaMesh.instanceMatrix.needsUpdate = true;
    }
  }
  
  requestAnimationFrame(animateKill);
}


export function divisionEvent(scene) {
  let newBacs = [];
  for (let i = 0; i < bacteria.length; i++) {
    divideBacterium(bacteria[i], newBacs);
  }
  bacteria = newBacs;
  updateInstancedMesh();
}

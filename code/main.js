// mod/ecoliplugin/code/main.js

import { initPetriScene } from './petri.js';
import { createThermometer } from './temp.js';
import { challenges, triggerScheduledChallenges } from './challenges.js';
import { addBacterium, growBacteria, killAllBacteria, divisionEvent, smoothDivisionForCount } from './bacteria.js';
import { SimulationParameters, TemperatureParameters, getTemperatureSettings } from './parameters.js';

document.getElementById("start-game").addEventListener("click", startGame);

let sceneObjects;
let thermometer;
let stepsPassed = 0;
const stepDuration = SimulationParameters.stepDuration;
const totalSteps = SimulationParameters.totalSteps;
let shuffledChallenges = [];
let challengeSchedule = [];
let temperature = null;
let bacteriaGrowthRate = 0;
let growthMultiplier = 1;
let foodEnded = false;
let stepTimeout;
let hiddenPoints = 0;

window.growthMultiplier = growthMultiplier;
window.foodEnded = foodEnded;
window.hiddenPoints = hiddenPoints;

function startGame() {
  const tempInput = document.getElementById("initial-temperature");
  temperature = parseInt(tempInput.value, 10);
  if (isNaN(temperature)) {
    alert("Prašome įvesti pradinę temperatūrą.");
    return;
  }
  document.getElementById("start-screen").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  const tempSettings = getTemperatureSettings(temperature, TemperatureParameters);
  bacteriaGrowthRate = tempSettings.bacteriaGrowthRate;
  hiddenPoints = tempSettings.hiddenPoints;
  window.hiddenPoints = hiddenPoints;

  growthMultiplier = bacteriaGrowthRate;
  window.growthMultiplier = growthMultiplier;

  sceneObjects = initPetriScene();
  thermometer = createThermometer();
  window.thermometer = thermometer;
  thermometer.updateTemperature(temperature);

  shuffledChallenges = shuffleArray(challenges);
  stepsPassed = 0;
  foodEnded = false;
  window.foodEnded = foodEnded;

  challengeSchedule = [];
  const numChallenges = Math.min(6, shuffledChallenges.length);
  for (let i = 0; i < numChallenges; i++) {
      const randomStep = Math.floor(Math.random() * totalSteps) + 1;
      challengeSchedule.push({ challenge: shuffledChallenges[i], step: randomStep });
  }
  challengeSchedule.sort((a, b) => a.step - b.step);

  addBacterium(sceneObjects.scene);
  stepTimeout = setTimeout(updateStep, stepDuration);
}

function updateStep() {
  stepsPassed++;
  document.getElementById("day-counter").textContent = stepsPassed;
  document.getElementById("growth-factor").textContent = window.growthMultiplier.toFixed(2);

  if (stepsPassed <= 8) {
    if (stepsPassed % 3 === 0) {
      divisionEvent(sceneObjects.scene);
    }
    growBacteria(bacteriaGrowthRate, window.growthMultiplier, sceneObjects.scene);
  } else {
    const adjustedCount = Math.max(1, Math.floor(50 * window.growthMultiplier));
    smoothDivisionForCount(sceneObjects.scene, adjustedCount);
  }

  const scheduled = challengeSchedule.filter(item => item.step === stepsPassed);
  if (scheduled.length > 0) {
      triggerScheduledChallenges(scheduled, continueSimulation);
  } else {
      continueSimulation();
  }
}

function continueSimulation() {
  if (bacteriaGrowthRate === 0 || window.growthMultiplier === 0) {
      killAllBacteria(sceneObjects.scene);
      gameOverModal();
      return;
  }
  if (stepsPassed < totalSteps) {
      stepTimeout = setTimeout(updateStep, stepDuration);
  } else {
      endGame();
  }
}

function endGame() {
  const modal = document.createElement("div");
  modal.id = "gameover-modal"; 
  const header = document.createElement("h1");
  header.textContent = "Bakterijų kolonija išgyveno!";
  modal.appendChild(header);

  const btn = document.createElement("button");
  btn.textContent = "Baigti";
  btn.addEventListener("click", () => {
    window.location.href = window.ECOLIPLUGIN_RETURN_URL;
  });
  modal.appendChild(btn);

  document.body.appendChild(modal);

  submitScore(window.hiddenPoints);
}

function gameOverModal() {
  const modal = document.createElement("div");
  modal.id = "gameover-modal";
  const header = document.createElement("h1");
  header.textContent = "Bakterijos žuvo :(";
  modal.appendChild(header);
  const btn = document.createElement("button");
  btn.textContent = "Baigti";
  // Nukreipiam į grįžimo URL (bandymų puslapį)
  btn.addEventListener("click", () => {
    window.location.href = window.ECOLIPLUGIN_RETURN_URL;
  });
  modal.appendChild(btn);
  document.body.appendChild(modal);
}

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function submitScore(finalScore) {
  const instanceId = window.ECOLIPLUGIN_INSTANCE_ID;
  fetch('ajax_update.php?id=' + instanceId + '&score=' + finalScore)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert("Score submitted successfully!");
      } else {
        alert("Error submitting score.");
      }
    })
    .catch(error => {
      console.error("Error submitting score:", error);
    });
}

export { startGame };


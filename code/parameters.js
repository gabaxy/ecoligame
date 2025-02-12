// parameters.js

import * as THREE from 'three';

export const TemperatureParameters = {
  optimal: { min: 35, max: 40, growthRate: 1, points: 15 },
  moderate: { min: 10, max: 35, growthRate: 0.5, points: 10 },
  moderateHigh: { min: 40, max: 50, growthRate: 0.5, points: 10 },
  fatal: { below: 10, growthRate: 0, points: 0 },
  fatalHigh: { min: 50, growthRate: 0, points: 0 }
};

export function getTemperatureSettings(temp) {
    let bacteriaGrowthRate;
    let hiddenPoints;
    
    if (temp >= TemperatureParameters.optimal.min && temp <= TemperatureParameters.optimal.max) {
      bacteriaGrowthRate = TemperatureParameters.optimal.growthRate;
      hiddenPoints = TemperatureParameters.optimal.points;
    } else if (temp >= TemperatureParameters.moderate.min && temp < TemperatureParameters.moderate.max) {
      bacteriaGrowthRate = TemperatureParameters.moderate.growthRate;
      hiddenPoints = TemperatureParameters.moderate.points;
    } else if (temp >= TemperatureParameters.moderateHigh.min && temp < TemperatureParameters.moderateHigh.max) {
      bacteriaGrowthRate = TemperatureParameters.moderateHigh.growthRate;
      hiddenPoints = TemperatureParameters.moderateHigh.points;
    } else if (temp < TemperatureParameters.fatal.below) {
      bacteriaGrowthRate = TemperatureParameters.fatal.growthRate;
      hiddenPoints = TemperatureParameters.fatal.points;
    } else if (temp >= TemperatureParameters.fatalHigh.min) {
      bacteriaGrowthRate = TemperatureParameters.fatalHigh.growthRate;
      hiddenPoints = TemperatureParameters.fatalHigh.points;
    }
    
    return { bacteriaGrowthRate, hiddenPoints };
  }

export const SimulationParameters = {
  stepDuration: 1000,    // 1 sekundė per žingsnį = 20 min žaidime
  totalSteps: 72         // 24 valandos * 3 žingsniai per valandą
};

export const ChallengeEffects = {
  1: { incorrectMultiplier: 0.5, correctMultiplier: 1.2, points: 10 },
  2: { incorrectMultiplier: 0.5, correctMultiplier: 1.2, points: 10 },
  3: { incorrectMultiplier: 0.5, correctMultiplier: 1.2, points: 10 },
  4: { incorrectMultiplier: 0, correctMultiplier: 1.2, gameOver: true, points: 15 },
  5: { incorrectMultiplier: 0, correctMultiplier: 1.2, gameOver: true, points: 15 },
  6: { incorrectMultiplier: 0, correctMultiplier: 1.2, gameOver: true, points: 15 }
};

export const BacteriumParams = {
  baseLength: 0.1,
  cellWidth: 0.03,
  cellHeight: 0.02,
  divisionThreshold: 0.2,
  spacing: 0.01
};

export const PetriParams = {
  center: new THREE.Vector3(0, 0.45, 0),
  radius: 4.8
};

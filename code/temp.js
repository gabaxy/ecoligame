// temp.js

export function createThermometer() {
    const container = document.getElementById("thermometer-container");
    container.innerHTML = "";
    
    const scale = document.createElement("div");
    scale.classList.add("thermometer-scale");
    for (let t = 50; t >= -15; t -= 5) {
      const tick = document.createElement("div");
      tick.classList.add("thermometer-tick");
      tick.textContent = t; 
      scale.appendChild(tick);
    }
    container.appendChild(scale);
    
    const fill = document.createElement("div");
    fill.classList.add("thermometer-fill");
    container.appendChild(fill);
    
    const label = document.createElement("div");
    label.classList.add("thermometer-label");
    container.appendChild(label);
    
    /**
     * @param {number} temp
     */
    function updateTemperature(temp) {
      let percentage = ((temp + 20) / 65) * 91;
      percentage = Math.max(0, Math.min(100, percentage));
      fill.style.height = percentage + "%";
      
      let fillColor = "#ffa500"; 
      if (temp >= 35 && temp <= 40) { 
        fillColor = "#00ff00"; 
      } else if (temp < 10) {
        fillColor = "#0000ff";
      } else if (temp >= 50) {
        fillColor = "#ff0000";
      }
      fill.style.backgroundColor = fillColor;
      
      label.textContent = temp + "°C";
    }
    
    return { updateTemperature };
  }
  
  /**
   * @param {object} TemperatureParameters
   * @returns {object}
   */
  export function getTemperatureSettings(temp, TemperatureParameters) {
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

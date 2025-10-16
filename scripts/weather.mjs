import { getUserLocation } from './location.mjs';

let latitude = null;
let longitude = null;

async function init() {
  const location = await getUserLocation();
  if (location) {
    latitude = location.latitude;
    longitude = location.longitude;

    localStorage.setItem('lat', latitude);
    localStorage.setItem('lon', longitude);

    fetchWeather();
  } else {
    console.log('Could not determine location.');
  }
}

init();

let useFahrenheit = false;
const celsiusSwitch = document.getElementById("celsius-switch");
celsiusSwitch.addEventListener("click", () => {
  toggleUnits();
});

function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function getWeatherIcon(code) {
  if (code === undefined || code === null) return "❓";
  if (code === 0) return "☀️";
  if (code === 1 || code === 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "🌨️";
  if (code >= 80 && code <= 82) return "🌦️";
  if (code >= 95 && code <= 99) return "⛈️";
  return "❓";
}

function toggleUnits() {
  const celsiusSwitch = document.querySelector(".celsius");
  if (!useFahrenheit) {
    celsiusSwitch.src = "images/celsius-light-mode.svg";
  } else {
    celsiusSwitch.src = "images/fahrenheit-light-mode.svg";
  }
  useFahrenheit = !useFahrenheit;
  document.getElementById("hourly-list").innerHTML = "";
  document.getElementById("daily-list").innerHTML = "";
  fetchWeather();
}

async function fetchWeather() {
  // Verificar se as variáveis existem
  if (localStorage.getItem('lat') !== null && localStorage.getItem('lon') !== null) {
    latitude = localStorage.getItem("lat");
    longitude = localStorage.getItem("lon");
  } 
  const apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,precipitation,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode&timezone=auto`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();

    // Current weather
    const current = data.current_weather;
    const currentTemp = useFahrenheit ? celsiusToFahrenheit(Math.round(current.temperature)) + "°F" : Math.round(current.temperature) + "°C";
    document.getElementById("temperature").innerHTML = `${getWeatherIcon(current.weathercode)} Temperature: ${currentTemp}`;

    // Hourly forecast
    const now = new Date();
    const hourlyList = document.getElementById("hourly-list");
    const hourlyTimes = data.hourly.time;
    const hourlyTemps = data.hourly.temperature_2m;
    const hourlyCodes = data.hourly.weathercode;

    for (let i = 0; i < hourlyTimes.length; i++) {
      const time = new Date(hourlyTimes[i]);
      if (time > now && time <= new Date(now.getTime() + 12 * 60 * 60 * 1000)) {
        const li = document.createElement("li");
        const hour = time.toLocaleTimeString([], { hour: '2-digit', hour12: false }) + "h";
        const temp = useFahrenheit ? celsiusToFahrenheit(Math.round(hourlyTemps[i])) + "°F" : Math.round(hourlyTemps[i]) + "°C";
        li.textContent = `${hour}: ${getWeatherIcon(hourlyCodes[i])} ${temp}`;
        hourlyList.appendChild(li);
      }
    }

    // Daily forecast
    const dailyList = document.getElementById("daily-list");
    const dailyTimes = data.daily.time;
    const dailyMax = data.daily.temperature_2m_max;
    const dailyMin = data.daily.temperature_2m_min;
    const dailyCodes = data.daily.weathercode;

    for (let i = 0; i < dailyTimes.length; i++) {
      const li = document.createElement("li");
      const max = useFahrenheit ? celsiusToFahrenheit(Math.round(dailyMax[i])) + "°F" : Math.round(dailyMax[i]) + "°C";
      const min = useFahrenheit ? celsiusToFahrenheit(Math.round(dailyMin[i])) + "°F" : Math.round(dailyMin[i]) + "°C";
      li.textContent = `${getWeatherIcon(dailyCodes[i])} ${max} - ${min} : ${dailyTimes[i]}`;
      dailyList.appendChild(li);
    }
  } catch (error) {
    console.error("Failed to fetch weather data:", error);
  }
}
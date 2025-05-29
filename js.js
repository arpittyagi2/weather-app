const apiKey = 'YOUR_OPENWEATHERMAP_API_KEY'; // Replace with your OpenWeatherMap API key

// Select DOM elements (update selectors as per your HTML)
const form = document.getElementById('weather-form');
const input = document.getElementById('city-input');
const result = document.getElementById('weather-result');

async function fetchWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('City not found');
  return res.json();
}

function displayWeather(data) {
  result.innerHTML = `
    <h2>${data.name}, ${data.sys.country}</h2>
    <p>${data.weather[0].description}</p>
    <p>Temperature: ${data.main.temp}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind: ${data.wind.speed} m/s</p>
  `;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const city = input.value.trim();
  if (!city) return;
  result.textContent = 'Loading...';
  try {
    const data = await fetchWeather(city);
    displayWeather(data);
  } catch (err) {
    result.textContent = 'Error: ' + err.message;
  }
});

// Optional: Real-time update as user types (debounced)
let debounceTimer;
input.addEventListener('input', () => {
  clearTimeout(debounceTimer);
  const city = input.value.trim();
  if (!city) {
    result.innerHTML = '';
    return;
  }
  debounceTimer = setTimeout(async () => {
    result.textContent = 'Loading...';
    try {
      const data = await fetchWeather(city);
      displayWeather(data);
    } catch (err) {
      result.textContent = 'Error: ' + err.message;
    }
  }, 800);
});
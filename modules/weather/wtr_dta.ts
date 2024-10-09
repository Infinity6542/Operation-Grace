if (localStorage.getItem("target") === null || localStorage.getItem("key") === null) {
  localStorage.setItem("key", prompt("Please enter your Tomorrow.io API key:"));
  localStorage.setItem("location", prompt("Please enter your location (lat: [lat], lon: [lon]):"));
}

const API_KEY = localStorage.getItem("key");
const LOCATION = JSON.parse("{ " + localStorage.getItem("location" + " }")); // Coordinates for North Sydney
const API_URL = "https://api.tomorrow.io/v4/timelines?location=${LOCATION.lat},${LOCATION.lon}&fields=temperature,precipitationProbability&timesteps=1h&units=metric&apikey=${API_KEY}";

async function getWeatherData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("HTTP error! status: ${response.status}");
    }
    const data = await response.json();

    // Extract current weather data
    const currentWeather = data.data.timelines[0].intervals[0];
    const currentTemperature = currentWeather.values.temperature;
    const currentPrecipitation = currentWeather.values.precipitationProbability;

    console.log("Current temperature: ${currentTemperature}°C");
    console.log("Current rain probability: ${currentPrecipitation}%");

    // Extract next 12 hours weather data (hourly)
    console.log("Next 24-hour forecast for " + LOCATION.lat + ", " + LOCATION.lon + ":");

    for (let i = 0; i < 12; i++) {
      const hourlyWeather = data.data.timelines[0].intervals[i];
      const temperature = hourlyWeather.values.temperature;
      const precipitation = hourlyWeather.values.precipitationProbability;
      const time = hourlyWeather.startTime;
      console.log(
        `Time: ${time}, Temperature: ${temperature}°C, Rain Probability: ${precipitation}%`
      );
    }
  } catch (error) {
    console.error("Error fetching the weather data:", error);
  }
}
getWeatherData();
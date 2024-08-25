// Replace 'YOUR_API_KEY' with your actual Tomorrow.io API key
const API_KEY = "l4k0PcH7aTO4GcK2mZcuk9KMDJLa4og0";
const LOCATION = { lat: -33.839, lon: 151.207 }; // Coordinates for North Sydney
const API_URL = `https://api.tomorrow.io/v4/timelines?location=${LOCATION.lat},${LOCATION.lon}&fields=temperature,precipitationProbability&timesteps=1h&units=metric&apikey=${API_KEY}`;

async function getWeatherData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Extract current weather data
    const currentWeather = data.data.timelines[0].intervals[0];
    const currentTemperature = currentWeather.values.temperature;
    const currentPrecipitation = currentWeather.values.precipitationProbability;

    console.log(`Current temperature: ${currentTemperature}°C`);
    console.log(`Current rain probability: ${currentPrecipitation}%`);

    // Extract next 24 hours weather data (hourly data)
    console.log(`Next 24-hour forecast for North Sydney:`);

    for (let i = 0; i < 24; i++) {
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

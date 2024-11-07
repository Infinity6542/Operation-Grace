if (
  localStorage.getItem("target") === null ||
  localStorage.getItem("key") === null
) {
  let x = prompt("Please enter your Tomorrow.io API key:");
  let y = prompt('Please enter your location ("lat":"[lat]","lon":"[lon])"');
  localStorage.setItem("key", x);
  localStorage.setItem("location", y);
}

const API_KEY = localStorage.getItem("key");
const LOCATION = JSON.parse("{ " + localStorage.getItem("location") + " }"); // Coordinates for North Sydney
const API_URL = `https://api.tomorrow.io/v4/timelines?location=${LOCATION.lat},${LOCATION.lon}&fields=temperature,precipitationProbability,precipitationIntensity,temperatureApparent,temperatureMax,temperatureMin&timesteps=1h&units=metric&apikey=${API_KEY}`;

async function updateWeatherDisplay() {
  try {
    // Fetch weather data
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch weather data");
    } else {
      console.log("[WTR] [LOG] Data fetched!");
    }
    const data = await response.json();

    // Assuming you have weather data in the response
    const weatherData = data.data.timelines[0].intervals[0].values;

    console.log("[WTR] [LOG] Updating current information");
    (document.getElementById("location") as HTMLElement).textContent =
      "North Sydney"; // Replace with actual location data if needed
    (document.getElementById("temp") as HTMLElement).textContent =
      weatherData.temperature.toFixed(1);
    (document.getElementById("feelsLikeTemp") as HTMLElement).textContent =
      weatherData.temperatureApparent.toFixed(1);
    (document.getElementById("highTemp") as HTMLElement).textContent =
      weatherData.temperatureMax.toFixed(1);
    (document.getElementById("lowTemp") as HTMLElement).textContent =
      weatherData.temperatureMin.toFixed(1);

    console.log("[WTR] [LOG] Updating hourly forecast");
    data.data.timelines[0].intervals.slice(0, 12).forEach((interval, index) => {
      const tempElem = document.querySelector(
        `[data-time="${index + 1}"] #temp`
      ) as HTMLElement;
      const chanceElem = document.querySelector(
        `[data-time="${index + 1}"] #chance`
      ) as HTMLElement;
      const rainElem = document.querySelector(
        `[data-time="${index + 1}"] #rain`
      ) as HTMLElement;
      const timeElem = document.querySelector(
        `[data-time="${index + 1}"] #time`
      ) as HTMLElement;

      tempElem.textContent = interval.values.temperature.toFixed(1);
      chanceElem.textContent =
        interval.values.precipitationProbability.toFixed(0);
      rainElem.textContent = interval.values.precipitationIntensity.toFixed(1);
      timeElem.textContent = new Date(interval.startTime).toLocaleTimeString(
        [],
        { hour: "2-digit", minute: "2-digit" }
      );
    });
  } catch (error) {
    console.error("Error updating weather display:", error);
  }
}

// Call the function to update the display on load
updateWeatherDisplay();

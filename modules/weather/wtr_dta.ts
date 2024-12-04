if (
	localStorage.getItem("location") === null ||
	localStorage.getItem("key") === null
) {
	let x = prompt("Please enter your Tomorrow.io API key:");
	let y = prompt('Please enter your location');
	localStorage.setItem("key", x);
	localStorage.setItem("location", y);
}

const dp = 0;
const API_KEY = localStorage.getItem("key");
const LOCATION = localStorage.getItem("location"); 
const API_URL = `https://api.tomorrow.io/v4/timelines?location=${LOCATION}&fields=temperature,precipitationProbability,precipitationIntensity,temperatureApparent,temperatureMax,temperatureMin&timesteps=1h,1d,current&units=metric&apikey=${API_KEY}`;
window.alert(`All values are rounded to the closest ${dp} decimal places`);

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
		console.log(data);
		const hourlyWeatherData = data.data.timelines[1].intervals[0].values;
		const dailyWeatherData = data.data.timelines[0].intervals[0].values;
    const realtimeWeatherData = data.data.timelines[2].intervals[0].values;

		console.log("[WTR] [LOG] Updating current information");
		(document.getElementById("location") as HTMLElement).textContent =
			"North Sydney"; // Replace with actual location data if needed
		(document.getElementById("temp") as HTMLElement).textContent =
			realtimeWeatherData.temperature.toFixed(dp);
		(document.getElementById("feelsLikeTemp") as HTMLElement).textContent =
			realtimeWeatherData.temperatureApparent.toFixed(dp);
		(document.getElementById("highTemp") as HTMLElement).textContent =
			dailyWeatherData.temperatureMax.toFixed(dp);
		(document.getElementById("lowTemp") as HTMLElement).textContent =
			dailyWeatherData.temperatureMin.toFixed(dp);

		console.log("[WTR] [LOG] Updating hourly forecast");
		data.data.timelines[1].intervals.slice(0, 12).forEach((interval, index) => {
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

			tempElem.textContent = interval.values.temperature.toFixed(dp);
			chanceElem.textContent =
				interval.values.precipitationProbability.toFixed(dp);
			rainElem.textContent = interval.values.precipitationIntensity.toFixed(dp);
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

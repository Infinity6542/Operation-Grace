import updateTempGraph from "./graph.js";

if (
	localStorage.getItem("location") === null ||
	localStorage.getItem("key") === null
) {
	let x = prompt("Please enter your Tomorrow.io API key:");
	let y = prompt("Please enter your location");
	localStorage.setItem("key", x);
	localStorage.setItem("location", y);
}

const dp = 0;
const key = localStorage.getItem("key");
const target = localStorage.getItem("location");
const api = `https://api.tomorrow.io/v4/timelines?location=${target}&fields=temperature,precipitationProbability,precipitationIntensity,temperatureApparent,temperatureMax,temperatureMin&timesteps=1h,1d,current&units=metric&apikey=${key}`;

async function getWeatherData(x?: boolean) {
	// Call getWeatherData(true) to force using cached data
	//
	// getWeatherData() will automatically fetch new data if
	// "frequency" seconds have elapsed since the last fetch
	let _t = Date.now();
	let _tslu = localStorage.getItem("timeSinceLastUpdate");
	let _frequency = 60000; // milliseconds
	if (x == true) {
		console.log("[WTR] [DTA] Using cached data.");
		let data = JSON.parse(localStorage.getItem("data"));
		return data;
	} else {
		if (_t - parseInt(_tslu) >= _frequency || _t == null) {
			// If it has been longer than a minute since the last update
			try {
				console.log("[WTR] [DTA] Fetching new data");
				const response = await fetch(api);
				if (!response.ok) {
					throw new Error("[WTR] [DTA] Failed to fetch weather data");
				} else {
					console.log("[WTR] [DTA] Request sent");
				}
				const data = await response.json();
				console.log("[WTR] [DTA] Data fetched");
				localStorage.setItem("data", JSON.stringify(data));
				localStorage.setItem("timeSinceLastUpdate", Date.now().toString());
				return data;
			} catch (error) {
				console.error("[WTR] [CRT] [GWD] ", error);
			}
		} else {
			console.log(
				`[WTR] [DTA] It hasn't been ${_frequency}ms since the last fetch. Using cached data.`
			);
			let data = JSON.parse(localStorage.getItem("data"));
			return data;
		}
	}
}

async function updateWeatherDisplay() {
	try {
		await getWeatherData().then((data) => {
			const hourlyWeatherData = data.data.timelines[1].intervals.slice(0, 12);
			const dailyWeatherData = data.data.timelines[0].intervals[0].values;
			const realtimeWeatherData = data.data.timelines[2].intervals[0].values;
			console.log("[WTR] [LOG] Updating realtime information");
			(document.getElementById("location") as HTMLElement).textContent =
				String(target).charAt(0).toUpperCase() + String(target).slice(1); // Replace with actual location data if needed
			(document.getElementById("temp") as HTMLElement).textContent =
				realtimeWeatherData.temperature.toFixed(dp);
			(document.getElementById("feelsLikeTemp") as HTMLElement).textContent =
				realtimeWeatherData.temperatureApparent.toFixed(dp);
			(document.getElementById("highTemp") as HTMLElement).textContent =
				dailyWeatherData.temperatureMax.toFixed(dp);
			(document.getElementById("lowTemp") as HTMLElement).textContent =
				dailyWeatherData.temperatureMin.toFixed(dp);
			console.log("[WTR] [LOG] Realtime information updated");
			console.log("[WTR] [LOG] Updating hourly forecast");
			hourlyWeatherData.forEach((interval, index) => {
				const tempEl = document.querySelector(
					`[data-time="${index + 1}"] #temp`
				) as HTMLElement;
				const chanceEl = document.querySelector(
					`[data-time="${index + 1}"] #chance`
				) as HTMLElement;
				const rainEl = document.querySelector(
					`[data-time="${index + 1}"] #rain`
				) as HTMLElement;
				const timeEl = document.querySelector(
					`[data-time="${index + 1}"] #time`
				) as HTMLElement;
				tempEl.textContent = interval.values.temperature.toFixed(dp);
				chanceEl.textContent =
					interval.values.precipitationProbability.toFixed(dp);
				rainEl.textContent = interval.values.precipitationIntensity.toFixed(dp);
				timeEl.textContent = new Date(interval.startTime)
					.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					})
					.replace(":", "");
			});
			document.querySelector("#time").innerHTML = "Now";
			console.log("[WTR] [LOG] Hourly forecast updated");
			// console.log(hourlyWeatherData);
		});
	} catch (error) {
		console.error("[WTR] [CRT] [UPD]", error);
	}
}
// Call the function to update the display on load
updateWeatherDisplay();

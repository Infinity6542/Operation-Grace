import updateTempGraph from "./graph.js";
const wtrCodeAssociations = {
	"0": "",
	"1000": "./resources/ico/main/Day/sunny.png",
	"1100": "./resources/ico/main/Day/pcloudy.png",
	"1101": "./resources/ico/main/Day/pcloudy.png",
	"1102": "./resources/ico/main/Day/mcloudy.png",
	"1001": "./resources/ico/main/Day/Cloudy.png",
	"2000": "./resources/ico/main/Day/Foggy.png",
	"2100": "./resources/ico/main/Day/Foggy.png",
	"4000": "./resources/ico/main/Day/Lrain.png",
	"4001": "./resources/ico/main/Day/Rain.png",
	"4200": "./resources/ico/main/Day/Lrain.png",
	"4201": "./resources/ico/main/Day/Rain.png",
	"5000": "./resources/ico/main/Day/Snow.png",
	"5001": "./resources/ico/main/Other/lsnow.png",
	"5100": "./resources/ico/main/Other/lsnow.png",
	"5101": "./resources/ico/main/other/Snow.png",
	"6001": "./resources/ico/main/other/sleet.png",
	"6200": "./resources/ico/main/other/sleet.png",
	"6201": "./resources/ico/main/other/sleet.png",
	"7000": "./resources/ico/main/Day/hail.png",
	"7101": "./resources/ico/main/Day/hail.png",
	"7102": "./resources/ico/main/Day/hail.png",
	"8000": "./resources/ico/main/Day/TStorm.png",
};

if (
	localStorage.getItem("location") === null ||
	localStorage.getItem("key") === null
) {
	let x = prompt("Please enter your Tomorrow.io API key:");
	let y = prompt("Please enter your location");
	localStorage.setItem("key", x);
	localStorage.setItem("location", y);
	window.alert(
		"Saved in localstorage. Refresh after data fetch to view the chart."
	);
}

const dp = 0;
const key = localStorage.getItem("key");
const target = localStorage.getItem("location");
const api = `https://api.tomorrow.io/v4/timelines?location=${target}&fields=weatherCode,temperature,precipitationProbability,precipitationIntensity,temperatureApparent,temperatureMax,temperatureMin&timesteps=1h,1d,current&units=metric&apikey=${key}`;

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
		if (_t - parseInt(_tslu) >= _frequency || _tslu == null) {
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
			const dailyWeatherData = data.data.timelines[0].intervals.slice(0, 6);
			const realtimeWeatherData = data.data.timelines[2].intervals[0].values;
			console.log("[WTR] [LOG] Updating realtime information");
			let wtrCodeIco = wtrCodeAssociations[realtimeWeatherData.weatherCode];
			(document.getElementById("location") as HTMLElement).textContent =
				String(target).charAt(0).toUpperCase() + String(target).slice(1); // Replace with actual location data if needed
			(document.getElementById("temp") as HTMLElement).textContent =
				realtimeWeatherData.temperature.toFixed(dp);
			(document.getElementById("feelsLikeTemp") as HTMLElement).textContent =
				realtimeWeatherData.temperatureApparent.toFixed(dp);
			(document.getElementById("highTemp") as HTMLElement).textContent =
				realtimeWeatherData.temperatureMax.toFixed(dp);
			(document.getElementById("lowTemp") as HTMLElement).textContent =
				realtimeWeatherData.temperatureMin.toFixed(dp);
			(
				document.getElementById("wtrCode") as HTMLElement
			).innerHTML = `<img src="${wtrCodeIco}"></img>`;
			console.log("[WTR] [LOG] Realtime information updated");
			console.log("[WTR] [LOG] Updating hourly forecast");
			hourlyWeatherData.forEach((_interval, _index) => {
				const _tempEl = document.querySelector(
					`[data-time="${_index + 1}"] #temp`
				) as HTMLElement;
				const _chanceEl = document.querySelector(
					`[data-time="${_index + 1}"] #chance`
				) as HTMLElement;
				const _rainEl = document.querySelector(
					`[data-time="${_index + 1}"] #rain`
				) as HTMLElement;
				const _timeEl = document.querySelector(
					`[data-time="${_index + 1}"] #time`
				) as HTMLElement;
				_tempEl.textContent = _interval.values.temperature.toFixed(dp);
				_chanceEl.textContent =
					_interval.values.precipitationProbability.toFixed(dp);
				_rainEl.textContent =
					_interval.values.precipitationIntensity.toFixed(dp);
				_timeEl.textContent = new Date(_interval.startTime)
					.toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
						hour12: false,
					})
					.replace(":", "");
			});
			console.log(dailyWeatherData);
			console.log(data);
			dailyWeatherData.forEach((_interval, _index) => {
				let __index = _index + 1;
				if (__index == 6) return;
				let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
				const _day = document.querySelector(
					`[data-day="${__index}"] #day`
				) as HTMLElement;
				const _wtrCo = document.querySelector(
					`[data-day="${__index}"] #wtrCo`
				) as HTMLImageElement;
				const _temp = document.querySelector(
					`[data-day="${__index}"] #dTemp`
				) as HTMLElement;
				_day.textContent = days[new Date(_interval.startTime).getDay() + 1];
				_wtrCo.src = wtrCodeAssociations[_interval.values.weatherCode];
				_temp.textContent = _interval.values.temperature.toFixed(dp) + "°";
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
// .then(() => {
// 	updateTempGraph();
// });

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
if (localStorage.getItem("target") === null || localStorage.getItem("key") === null) {
    localStorage.setItem("key", prompt("Please enter your Tomorrow.io API key:"));
    localStorage.setItem("location", prompt("Please enter your location (lat: [lat], lon: [lon]):"));
}
var API_KEY = localStorage.getItem("key");
var LOCATION = JSON.parse("{ " + localStorage.getItem("location" + " }")); // Coordinates for North Sydney
var API_URL = "https://api.tomorrow.io/v4/timelines?location=".concat(LOCATION.lat, ",").concat(LOCATION.lon, "&fields=temperature,precipitationProbability&timesteps=1h&units=metric&apikey=").concat(API_KEY);
function getWeatherData() {
    return __awaiter(this, void 0, void 0, function () {
        var response, data, currentWeather, currentTemperature, currentPrecipitation, i, hourlyWeather, temperature, precipitation, time, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch(API_URL)];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    data = _a.sent();
                    currentWeather = data.data.timelines[0].intervals[0];
                    currentTemperature = currentWeather.values.temperature;
                    currentPrecipitation = currentWeather.values.precipitationProbability;
                    console.log("Current temperature: ".concat(currentTemperature, "\u00B0C"));
                    console.log("Current rain probability: ".concat(currentPrecipitation, "%"));
                    // Extract next 12 hours weather data (hourly)
                    console.log("Next 24-hour forecast for North Sydney:");
                    for (i = 0; i < 12; i++) {
                        hourlyWeather = data.data.timelines[0].intervals[i];
                        temperature = hourlyWeather.values.temperature;
                        precipitation = hourlyWeather.values.precipitationProbability;
                        time = hourlyWeather.startTime;
                        console.log("Time: ".concat(time, ", Temperature: ").concat(temperature, "\u00B0C, Rain Probability: ").concat(precipitation, "%"));
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error fetching the weather data:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
getWeatherData();

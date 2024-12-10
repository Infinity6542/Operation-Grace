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
if (localStorage.getItem("location") === null ||
    localStorage.getItem("key") === null) {
    var x = prompt("Please enter your Tomorrow.io API key:");
    var y = prompt("Please enter your location");
    localStorage.setItem("key", x);
    localStorage.setItem("location", y);
}
var dp = 0;
var key = localStorage.getItem("key");
var target = localStorage.getItem("location");
var api = "https://api.tomorrow.io/v4/timelines?location=".concat(target, "&fields=temperature,precipitationProbability,precipitationIntensity,temperatureApparent,temperatureMax,temperatureMin&timesteps=1h,1d,current&units=metric&apikey=").concat(key);
function getWeatherData(x) {
    return __awaiter(this, void 0, void 0, function () {
        var _t, _tslu, _frequency, data, response, data, error_1, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _t = Date.now();
                    _tslu = localStorage.getItem("timeSinceLastUpdate");
                    _frequency = 60000;
                    if (!(x == true)) return [3 /*break*/, 1];
                    console.log("[WTR] [DTA] Using cached data.");
                    data = JSON.parse(localStorage.getItem("data"));
                    return [2 /*return*/, data];
                case 1:
                    if (!(_t - parseInt(_tslu) >= _frequency || _t == null)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    console.log("[WTR] [DTA] Fetching new data");
                    return [4 /*yield*/, fetch(api)];
                case 3:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("[WTR] [DTA] Failed to fetch weather data");
                    }
                    else {
                        console.log("[WTR] [DTA] Request sent");
                    }
                    return [4 /*yield*/, response.json()];
                case 4:
                    data = _a.sent();
                    console.log("[WTR] [DTA] Data fetched");
                    console.log(data);
                    localStorage.setItem("data", JSON.stringify(data));
                    localStorage.setItem("timeSinceLastUpdate", Date.now().toString());
                    return [2 /*return*/, data];
                case 5:
                    error_1 = _a.sent();
                    console.error("[WTR] [CRT] [GWD] ", error_1);
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    console.log("[WTR] [DTA] It hasn't been a minute since the last fetch. Using cached data.");
                    data = JSON.parse(localStorage.getItem("data"));
                    return [2 /*return*/, data];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function updateWeatherDisplay() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, getWeatherData().then(function (data) {
                            var hourlyWeatherData = data.data.timelines[1].intervals[0].values;
                            var dailyWeatherData = data.data.timelines[0].intervals[0].values;
                            var realtimeWeatherData = data.data.timelines[2].intervals[0].values;
                            console.log("[WTR] [LOG] Updating realtime information");
                            document.getElementById("location").textContent =
                                String(target).charAt(0).toUpperCase() + String(target).slice(1); // Replace with actual location data if needed
                            document.getElementById("temp").textContent =
                                realtimeWeatherData.temperature.toFixed(dp);
                            document.getElementById("feelsLikeTemp").textContent =
                                realtimeWeatherData.temperatureApparent.toFixed(dp);
                            document.getElementById("highTemp").textContent =
                                dailyWeatherData.temperatureMax.toFixed(dp);
                            document.getElementById("lowTemp").textContent =
                                dailyWeatherData.temperatureMin.toFixed(dp);
                            console.log("[WTR] [LOG] Realtime information updated");
                            console.log("[WTR] [LOG] Updating hourly forecast");
                            data.data.timelines[1].intervals
                                .slice(0, 12)
                                .forEach(function (interval, index) {
                                var tempElem = document.querySelector("[data-time=\"".concat(index + 1, "\"] #temp"));
                                var chanceElem = document.querySelector("[data-time=\"".concat(index + 1, "\"] #chance"));
                                var rainElem = document.querySelector("[data-time=\"".concat(index + 1, "\"] #rain"));
                                var timeElem = document.querySelector("[data-time=\"".concat(index + 1, "\"] #time"));
                                tempElem.textContent = interval.values.temperature.toFixed(dp);
                                chanceElem.textContent =
                                    interval.values.precipitationProbability.toFixed(dp);
                                rainElem.textContent =
                                    interval.values.precipitationIntensity.toFixed(dp);
                                timeElem.textContent = new Date(interval.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                            });
                            console.log("[WTR] [LOG] Hourly forecast updated");
                        })];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.error("[WTR] [CRT] [UPD]", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Call the function to update the display on load
updateWeatherDisplay();

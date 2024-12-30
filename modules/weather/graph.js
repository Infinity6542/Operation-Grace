let data = JSON.parse(
	localStorage.getItem("data")
).data.timelines[1].intervals.slice(0, 12);
let graphData = [];
let ttlTemp = 0;
let avgTemp;
async function parseData() {
	try {
		for (let i = 0; i < 12; i++) {
			let d = new Date(data[i].startTime);
			// let x = d.getHours() + d.getMinutes();
			let x = i;
			let y = Math.round(data[i].values.temperature);
			ttlTemp += y;
			graphData.push({ time: x, temp: y });
		}
	} catch (e) {
		console.error("[WTR] [GRA] [ERR]" + e);
	} finally {
		avgTemp = ttlTemp / 12;
		// console.log(avgTemp);
	}
}

function e(d) {
	const e = document.getElementById("tempGraph");
	const simplePlugin = {
		beforeDraw: function (chartInstance) {
			let _stroke = chartInstance.ctx.stroke;
			chartInstance.ctx.stroke = function () {
				chartInstance.ctx.save();
				chartInstance.ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
				chartInstance.ctx.shadowBlur = 5;
				chartInstance.ctx.shadowOffsetX = 1;
				chartInstance.ctx.shadowOffsetY = 1;
				_stroke.apply(this, arguments);
				chartInstance.ctx.restore();
			};
		},
	};
	new Chart(e, {
		type: "line",
		data: {
			labels: d.map((a) => a.time),
			datasets: [
				{
					label: "",
					data: d.map((a) => a.temp),
					backgroundColor: (context) => {
						const c = [
							"hsl(358, 85.30%, 52.00%)",
							"hsl(22, 76.10%, 55.70%)",
							"hsl(39, 98.80%, 66.50%)",
							"hsl(143, 25.30%, 45.70%)",
							"hsl(198, 100.00%, 38.20%)",
						];
						if (!context.chart.chartArea) {
							return;
						}
						const {
							ctx,
							data,
							chartArea: { top, bottom },
						} = context.chart;
						const ggradientBg = ctx.createLinearGradient(0, top, 0, bottom);
						ggradientBg.addColorStop(0.1, c[0]);
						ggradientBg.addColorStop(0.3, c[1]);
						ggradientBg.addColorStop(0.5, c[2]);
						ggradientBg.addColorStop(0.8, c[3]);
						ggradientBg.addColorStop(0.9, c[4]);
						return ggradientBg;
					},
					// borderColor: "rgba(255, 99, 132, 1)",
					// borderWidth: 1,
					tension: 0.2,
					borderWidth: -10,
				},
			],
		},
		options: {
			scales: {
				y: {
					display: false,
					suggestedMin: 2,
					suggestedMax: 35,
				},
				x: {
					display: false,
				},
			},
			plugins: {
				legend: {
					display: false,
				},
			},
			elements: {
				point: {
					radius: 0,
				},
			},
			fill: true,
			layout: {
				padding: {
					left: -90,
					right: -90,
				},
			},
		},
		plugins: [simplePlugin],
	});
}

// async function updateTempGraph() {
await parseData().then(() => {
	e(graphData);
});
// }

// export default updateTempGraph();

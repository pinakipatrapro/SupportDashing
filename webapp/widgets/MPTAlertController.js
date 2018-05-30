sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.widgets.MPTAlert", {
		loadChart: function(model, chartId) {
			var maxBars =5;

			if (window.MPTAlert)
				window.clearInterval(window.MPTAlert);

			var totalDatasets = model.getData().expiringMPT.aDistinctCustomer;
			if (totalDatasets.length < maxBars) {
				var options = this.generateOptions();
				var dataset = this.generateDataset(model, 0, maxBars);
				var ctx = document.getElementById(chartId).getContext('2d');
				this.generateChart(dataset, options, ctx);
			} else {
				var lowerRange = 0;
				var upperRange = maxBars;
				window.MPTAlert = setInterval(function() {
					if (upperRange > totalDatasets.length) {
						upperRange = 0;
					}
					lowerRange = upperRange;
					upperRange = upperRange + maxBars;

					options = this.generateOptions();
					dataset = this.generateDataset(model, lowerRange, upperRange);
					ctx = document.getElementById(chartId).getContext('2d');
					this.generateChart(dataset, options, ctx);

				}.bind(this), maxBars * 1000);
			}
		},
		generateDataset: function(model, lowerRange, upperRange) {
			return {
				labels: model.getData().expiringMPT.aDistinctCustomer.slice(lowerRange, upperRange),
				datasets: [{
					label: "Open MPT",
					backgroundColor: "rgba(56, 132, 255, .2)",
					borderWidth:2,
					borderColor: "rgb(56, 132, 255)",
					data: model.getData().expiringMPT.aCount.slice(lowerRange, upperRange),
					type: 'bar'
				}]
			};
		},
		generateOptions: function() {
			return {
				title: {
					display: true,
					text: 'MPT Alerts (Expiring in 7 Days)',
					fontColor: '#bebebe',
					padding: 30,
					fontSize : 14,
					fontFamily : "Verdana"
				},
				legend: {
					display: false
				},
				animation: {
					onComplete: function() {
						var ctx = this.chart.ctx;
						ctx.textAlign = "center";
						ctx.textBaseline = "middle";
						var chart = this;
						var datasets = this.config.data.datasets;

						datasets.forEach(function(dataset, i) {
							ctx.font = "15px";
							switch (dataset.type) {
								case "bar":
									ctx.fillStyle = "white";
									chart.getDatasetMeta(i).data.forEach(function(p, j) {
										if (datasets[i].data[j] > 0) {
											ctx.fillText(datasets[i].data[j], p._model.x, p._model.y - 20);
										}
									});
									break;
							}
						});
					}
				},
				scales: {
					xAxes: [{
						barPercentage: 0.6,
						ticks: {
							autoSkip: false,
							maxRotation: 0,
							minRotation: 0,
							fontSize: 12
						}
					}],
					yAxes: [{
						display: false,
						ticks: {
							suggestedMin: 0, // minimum will be 0, unless there is a lower value.
							beginAtZero: true // minimum value will be 0.
						}
					}]
				},
				responsive: true
			};
		},
		generateChart: function(dataset, options, ctx) {
			return new Chart(ctx, {
				type: 'bar',
				data: dataset,
				options: options,
				plugins: [{
					beforeInit: function(chart) {
						chart.data.labels.forEach(function(e, i, a) {
							if (/\n/.test(e)) {
								a[i] = e.split(/\n/);
							}
						});
					}
				}]
			});
		}
	});
});
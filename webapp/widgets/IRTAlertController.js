sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.widgets.IRTAlert", {
		loadChart: function(model, chartId) {
			var maxBars = 5;

			if (window.IRTAlert)
				window.clearInterval(window.IRTAlert);

			var totalDatasets = model.getData().expiringIRT.aDistinctCustomer;
			if (totalDatasets.length < maxBars) {
				var options = this.generateOptions();
				var dataset = this.generateDataset(model, 0, maxBars);
				var ctx = document.getElementById(chartId).getContext('2d');
				this.generateChart(dataset, options, ctx);
			} else {
				var lowerRange = 0;
				var upperRange = maxBars;
				window.IRTAlert = setInterval(function() {
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
				labels: model.getData().expiringIRT.aDistinctCustomer.slice(lowerRange, upperRange),
				datasets: [{
					label: "Open IRT",
					backgroundColor: "rgba(67, 0, 252,.2)",
					borderColor: "rgb(67, 0, 252)",
					data: model.getData().expiringIRT.aCount.slice(lowerRange, upperRange),
					type: 'radar'
				}]
			};
		},
		generateOptions: function() {
			return {
				title: {
					display: true,
					text: 'IRT Alerts',
					fontColor: 'white'
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
								case "radar":
									ctx.fillStyle = "white";
									chart.getDatasetMeta(i).data.forEach(function(p, j) {
										ctx.fillText(datasets[i].data[j], p._model.x, p._model.y + 20);
									});
									break;
							}
						});
					}
				},
				scale: {
					pointLabels: {
						fontSize: 12
					},
					ticks: {
						display: false,
						beginAtZero: true
					}
				},
				elements: {
					line: {
						tension: 0.000001
					}
				},
				responsive: true
			};
		},
		generateChart: function(dataset, options, ctx) {
			return new Chart(ctx, {
				type: 'radar',
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
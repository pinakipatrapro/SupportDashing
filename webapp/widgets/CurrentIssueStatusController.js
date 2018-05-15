sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.widgets.CurrentIssueStatusController", {
		loadChart: function(model, chartId) {
			var maxBars = 30;

			if (window.currentIssueInterval)
				window.clearInterval(window.currentIssueInterval);

			var totalDatasets = model.getData().currentIssueByCustomer.aDistinctCustomer;
			if (totalDatasets.length < maxBars) {
				var options = this.generateOptions();
				var dataset = this.generateDataset(model, 0, maxBars);
				var ctx = document.getElementById(chartId).getContext('2d');
				this.generateChart(dataset, options, ctx);
			} else {
				var lowerRange = 0;
				var upperRange = maxBars;
				window.currentIssueInterval = setInterval(function() {
					if (upperRange > totalDatasets.length) {
						upperRange = 0;
					}
					lowerRange = upperRange;
					upperRange = upperRange + maxBars;

					options = this.generateOptions();
					dataset = this.generateDataset(model, lowerRange, upperRange);
					ctx = document.getElementById(chartId).getContext('2d');
					this.generateChart(dataset, options, ctx);

				}.bind(this), 5000);
			}
		},
		generateDataset: function(model, lowerRange, upperRange) {
			return {
				labels: model.getData().currentIssueByCustomer.aDistinctCustomer.slice(lowerRange, upperRange),
				datasets: [{
					label: "New",
					backgroundColor: "rgba(255, 0, 0,.2)",
					borderColor : "rgb(255, 0, 0)",
					borderWidth : 1,
					data: model.getData().currentIssueByCustomer.aNewStatus.slice(lowerRange, upperRange),
					type: 'horizontalBar'
				}, {
					label: "In Process",
					backgroundColor: "rgba(255, 238, 0,.2)",
					borderColor : "rgb(255, 238, 0)",
					borderWidth : 1,
					data: model.getData().currentIssueByCustomer.aInProcessStatus.slice(lowerRange, upperRange),
					type: 'horizontalBar'
				}]
			};
		},
		generateOptions: function() {
			return {
				title: {
					display: true,
					text: 'Current Issue Status',
					fontColor: 'white',
					padding: 30
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
								case "line":
									ctx.fillStyle = "white";
									chart.getDatasetMeta(i).data.forEach(function(p, j) {
										ctx.fillText(datasets[i].data[j], p._model.x, p._model.y + 20);
									});
									break;
								case "horizontalBar":
									ctx.fillStyle = "white";
									chart.getDatasetMeta(i).data.forEach(function(p, j) {
										if (datasets[i].data[j] > 0) {
											ctx.fillText(datasets[i].data[j], p._model.x- 20, p._model.y);
										}
									});
									break;
							}
						});
					}
				},
				scales: {
					xAxes: [{
						stacked: true,
						ticks: {
							fontColor: 'white',
							autoSkip: false,
							maxRotation: 0,
							minRotation: 0
						},
						gridLines: {
							display: true
						}
					}],
					yAxes: [{
						fontColor: 'white',
						stacked: true,
						display: true,
						ticks: {
							fontColor: 'white'
						},
						gridLines: {
							display: true
						}
					}]
				},
				responsive: true
			};
		},
		generateChart: function(dataset, options, ctx) {
			return new Chart(ctx, {
				type: 'horizontalBar',
				data: dataset,
				options: options,
				barPercentage : .7,
				// plugins: [{
				// 	beforeInit: function(chart) {
				// 		chart.data.labels.forEach(function(e, i, a) {
				// 			if (/\n/.test(e)) {
				// 				a[i] = e.split(/\n/);
				// 			}
				// 		});
				// 	}
				// }]
			});
		}
	});
});
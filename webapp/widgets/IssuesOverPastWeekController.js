sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.widgets.IssuesOverPastWeek", {
		loadChart: function(model, chartId) {
			var maxBars = 5;

			if (window.IssueOverPastWeek)
				window.clearInterval(window.IssueOverPastWeek);

			var totalDatasets = model.getData().issuesOverPastWeek.aDistinctCustomer;
			if (totalDatasets.length < maxBars) {
				var options = this.generateOptions();
				var dataset = this.generateDataset(model, 0, maxBars);
				var ctx = document.getElementById(chartId).getContext('2d');
				this.generateChart(dataset, options, ctx);
			} else {
				var lowerRange = 0;
				var upperRange = maxBars;
				window.IssueOverPastWeek = setInterval(function() {
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
				labels: model.getData().currentIssueByCustomer.aDistinctCustomer.slice(lowerRange, upperRange),
				datasets: [{
					label: "Issues",
					backgroundColor: 'rgba(168, 234, 255,.1)',
					borderColor: 'rgb(168, 234, 255)',
					data: model.getData().issuesOverPastWeek.aCount.slice(lowerRange, upperRange),
					type: 'line'
				}]
			};
		},
		generateOptions: function() {
			return {
				title: {
					display: true,
					text: 'Issues over past week',
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
										ctx.fillText(datasets[i].data[j], p._model.x, p._model.y - 20);
									});
									break;
								case "bar":
									ctx.fillStyle = "rgb(91, 91, 91)";
									chart.getDatasetMeta(i).data.forEach(function(p, j) {
										if (datasets[i].data[j] > 0) {
											ctx.fillText(datasets[i].data[j], p._model.x, p._model.y + 7);
										}
									});
									break;
							}
						});
					}
				},
				scales: {
					xAxes: [{
						ticks: {
							autoSkip: false,
							maxRotation: 0,
							minRotation: 0,
							fontSize: 12
						}
					}],
					yAxes: [{
						display: false
					}]
				},
				responsive: true
			};
		},
		generateChart: function(dataset, options, ctx) {
			return new Chart(ctx, {
				type: 'line',
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
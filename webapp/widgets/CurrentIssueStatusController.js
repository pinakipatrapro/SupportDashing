sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.widgets.CurrentIssueStatusController", {
		loadChart: function(model, chartId) {
			var maxBars = 7;

			for (var i = 1; i < 99999; i++)
				window.clearInterval(i);

			var totalDatasets = model.getData().currentIssueByCustomer.aDistinctCustomer;
			if (totalDatasets < maxBars) {
				var options = this.generateOptions();
				var dataset = this.generateDataset(model, 0, maxBars);
				var ctx = document.getElementById(chartId).getContext('2d');
				this.generateChart(dataset, options, ctx);
			} else {
				var lowerRange = 0;
				var upperRange = maxBars;
				setInterval(function() {
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
					backgroundColor: 'rgba(244,75,75,.50)',
					data: model.getData().currentIssueByCustomer.aNewStatus.slice(lowerRange, upperRange),
					type: 'bar'
				}, {
					label: "In Process",
					backgroundColor: 'rgba(255, 180, 38, 0.66)',
					data: model.getData().currentIssueByCustomer.aInProcessStatus.slice(lowerRange, upperRange),
					type: 'bar'
				}]
			};
		},
		generateOptions: function() {
			return {
				title: {
					display: true,
					text: 'Current Issue Status'
				},
				legend: {
					labels: {
						fontColor: 'white',
						defaultFontSize: 16
					}
				},
				scales: {
					xAxes: [{
						stacked: true,
						ticks: {
							autoSkip: false,
							maxRotation: 0,
							minRotation: 0
						}
					}],
					yAxes: [{
						stacked: true,
						ticks: {
							autoSkip: false,
							maxRotation: 90,
							minRotation: 90
						}
					}]
				}
			};
		},
		generateChart: function(dataset, options, ctx) {
			return new Chart(ctx, {
				type: 'bar',
				data: dataset,
				options: options
			});
		}
	});
});
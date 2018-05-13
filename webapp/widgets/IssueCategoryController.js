sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController"
], function(BaseController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.widgets.IssueCategory", {
		loadChart: function(model, chartId) {
			var options = this.generateOptions();
			var dataset = this.generateDataset(model);
			var ctx = document.getElementById(chartId).getContext('2d');
			this.generateChart(dataset, options, ctx);
		},
		generateDataset: function(model) {
			return {
				labels: model.getData().issueCategory.aCategories,
				datasets: [{
					backgroundColor: ["rgba(209, 0, 0,.3)", "rgba(252, 152, 2,.3)", "rgba(255, 241, 53,.3)", "rgba(168, 224, 255,.3)"],
					borderColor: ["rgb(209, 0, 0)", "rgb(252, 152, 2)", "rgb(255, 241, 53)", "rgb(168, 224, 255)"],
					data: model.getData().issueCategory.aCount,
					type: 'doughnut'
				}]
			};
		},
		generateOptions: function() {
			return {
				title: {
					display: true,
					text: 'Priority wise issues',
					fontColor: 'white'
				},
				legend: {
					display: false
				},
				pieceLabel: {
					render: 'percentage',
					fontColor: 'white'
				},
				responsive: true
			};
		},
		generateChart: function(dataset, options, ctx) {
			return new Chart(ctx, {
				type: 'doughnut',
				data: dataset,
				options: options
			});
		}
	});
});
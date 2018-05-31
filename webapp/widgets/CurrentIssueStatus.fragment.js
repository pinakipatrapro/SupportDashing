sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.CurrentIssueStatus", {
	createContent: function(oController) {
		return [
			new sap.m.Table({
				showNoData: false,
				columns: [
					new sap.m.Column({
						width: "15rem",
						mergeDuplicates: true,
						header: new sap.m.Text({
							text: "Customer"
						})
					}),
					new sap.m.Column({
						width: "15rem",
						header: new sap.m.Text({
							text: "Component"
						})
					}),
					new sap.m.Column({
						width: "4rem",
						header: new sap.m.Text({
							text: "In Process"
						})
					}),
					new sap.m.Column({
						width: "4rem",
						header: new sap.m.Text({
							text: "New"
						})
					}),
					new sap.m.Column({
						width: "6rem",
						header: new sap.m.Text({
							text: "Priority"
						})
					})
				]
			}),
			new sap.m.ScrollContainer({
				height: "900px",
				vertical: true,
				content: [
					new sap.m.Table({
						showNoData: false,
						columns: [
							new sap.m.Column({
								width: "15rem",
								mergeDuplicates: true
							}),
							new sap.m.Column({
								width: "15rem"
							}),
							new sap.m.Column({
								width: "6rem"
							}),
							new sap.m.Column({
								width: "4rem"
							}),
							new sap.m.Column({
								width: "6rem"
							})
						],
						items: {
							path: '/currentIssueByCustomer',
							template: new sap.m.ColumnListItem({
								cells: [
									new sap.m.Label({
										text: "{customer}"
									}),
									new sap.m.Label({
										text: "{category}"
									}),
									new sap.m.ObjectNumber({
										number: "{inProcessStatus}",
										visible: "{= ${inProcessStatus} !== 0 }",
										state: "Warning"
									}),
									new sap.m.ObjectNumber({
										number: "{newStatus}",
										visible: {
											path: 'newStatus',
											formatter: function(value) {
												var referencedObject = this.getParent().getBindingContext().getObject();
												if (referencedObject.newStatus > 0 && (referencedObject.priorityKey.high || referencedObject.priorityKey.veryHigh)) {
													this.getParent().addStyleClass('redBG');
												}
											}
										},
										state: "Error"
									}),
									new sap.suite.ui.microchart.StackedBarMicroChart({
										size: "S",
										bars: [
											new sap.suite.ui.microchart.StackedBarMicroChartBar({
												value: "{priorityKey/veryHigh}",
												displayValue: "{priorityKey/veryHigh}",
												valueColor: "#800000"
											}),
											new sap.suite.ui.microchart.StackedBarMicroChartBar({
												value: "{priorityKey/high}",
												displayValue: "{priorityKey/high}",
												valueColor: "#CD853F"
											}),
											new sap.suite.ui.microchart.StackedBarMicroChartBar({
												value: "{priorityKey/medium}",
												displayValue: "{priorityKey/medium}",
												valueColor: "#DAA520"
											}),
											new sap.suite.ui.microchart.StackedBarMicroChartBar({
												value: "{priorityKey/low}",
												displayValue: "{priorityKey/low}",
												valueColor: "#696969"
											})
										]
									})
								]
							}),
							sorter: new sap.ui.model.Sorter("customer", false)
						}
					}).addEventDelegate({
						"onAfterRendering": function(e) {
							if (window.currIssueInterval) {
								clearInterval(window.currIssueInterval);
							}
							var table = e.srcControl;
							var container = table.getParent();
							var maxY = $("#" + table.getId()).innerHeight();
							var currY = 0;
							var stepY = 200;
							window.currIssueInterval = setInterval(function() {
								currY = currY + stepY;
								container.scrollTo(0, currY, 1000);
								if (currY > maxY - 800) {
									currY = 0;
									setTimeout(function() {
										container.scrollTo(0, 0, 0)
									}, 1010);
								}
							}, 5000);
						}
					})
				]
			}).addStyleClass('Container')
		];
	}
});
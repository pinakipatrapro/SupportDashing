sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.CurrentIssueStatus", {
	createContent: function(oController) {
		return [
			new sap.m.HBox({
				items: [
					new sap.m.Table({
						showNoData: false,
						headerToolbar: new sap.m.Toolbar({
							content: [
								new sap.m.Label({
									text: "Customer"
								}),
								new sap.m.ToolbarSpacer(),
								new sap.m.Label({
									text: "Component"
								}),
								new sap.m.ToolbarSpacer(),
								new sap.m.Label({
									text: "In Process"
								}),
								new sap.m.ToolbarSpacer(),
								new sap.m.Label({
									width:"2rem",
									text: "New"
								}),
								new sap.m.ToolbarSpacer(),
								new sap.m.Label({
									text: "Priority"
								}),
								new sap.m.ToolbarSpacer(),
								new sap.m.Label()
							]
						})
					})
				]
			}),
			new sap.m.ScrollContainer({
				height: "850px",
				vertical: true,
				content: [
					new sap.m.Table({
						columns: [
							new sap.m.Column({
								mergeDuplicates: true,
								alternateRowColors : true,
								text: new sap.m.Text({
									text: "Customer"
								})
							}),
							new sap.m.Column({
								text: new sap.m.Text({
									text: "Component"
								})
							}),
							new sap.m.Column({
								text: new sap.m.Text({
									text: "In Process"
								})
							}),
							new sap.m.Column({
								width : "2rem",
								text: new sap.m.Text({
									text: "New"
								})
							}),
							new sap.m.Column({
								text: new sap.m.Text({
									text: "Priority"
								})
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
											path : 'newStatus',
											formatter : function(value){
												var referencedObject = this.getParent().getBindingContext().getObject();
												if(referencedObject.newStatus > 0 && referencedObject.priorityKey.high){
													this.getParent().addStyleClass('redBG');
												}
											}
										},
										state: "Error"
									}),
									new sap.suite.ui.microchart.StackedBarMicroChart({
										bars: [
											new sap.suite.ui.microchart.StackedBarMicroChartBar({
												value: "{priorityKey/veryHigh}",
												displayValue: "{priorityKey/veryHigh}",
												valueColor : "rgb(132, 13, 13)"
											}),
											new sap.suite.ui.microchart.StackedBarMicroChartBar({
												value: "{priorityKey/high}",
												displayValue: "{priorityKey/high}",
												valueColor : "rgb(140, 80, 1)"
											}),
											new sap.suite.ui.microchart.StackedBarMicroChartBar({
												value: "{priorityKey/medium}",
												displayValue: "{priorityKey/medium}",
												valueColor : "rgb(193, 171, 44)"
											}),
											new sap.suite.ui.microchart.StackedBarMicroChartBar({
												value: "{priorityKey/low}",
												displayValue: "{priorityKey/low}",
												valueColor : "#1e726e"
											})
										]
									})
								]
							}),
							sorter: {
								path: 'customer'
							}
						}
					})
				]
			})
		];
	}
});
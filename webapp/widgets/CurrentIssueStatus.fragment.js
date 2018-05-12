sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.CurrentIssueStatus", {
	createContent: function(oController) {
		return this.createViz(oController);
	},
	createViz: function(oController) {
		var oVizFrame = new sap.viz.ui5.controls.VizFrame({
			vizType: "stacked_column",
			width: "100%",
			layoutData: new sap.ui.layout.GridData({
				span: "L12 M12 S12"
			})
		});
		oVizFrame.setVizProperties({
			plotArea: {
				colorPalette: ['yellow', 'red'],
				dataLabel: {
					showTotal: true,
					visible : true
				}
			},
			tooltip: {
				visible: true
			},
			title: {
				text: "Current Issue Status"
			}
		});
		var oDataset = new sap.viz.ui5.data.FlattenedDataset({
			dimensions: [{
				name: "Customer",
				value: "{customerName}"
			}],

			measures: [{
				name: "In-Process",
				value: "{inProcessIssue}"
			}, {
				name: "New",
				value: "{newIssue}"
			}],

			data: {
				path: "/currentIssueByCustomer"
			}
		});
		oVizFrame.setDataset(oDataset);
		var oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				"uid": "valueAxis",
				"type": "Measure",
				"values": ["In-Process"]
			}),
			oFeedValueAxis1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
				"uid": "valueAxis",
				"type": "Measure",
				"values": ["New"]
			}),
			oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
				"uid": "categoryAxis",
				"type": "Dimension",
				"values": ["Customer"]
			});

		oVizFrame.addFeed(oFeedValueAxis);
		oVizFrame.addFeed(oFeedValueAxis1);
		oVizFrame.addFeed(oFeedCategoryAxis);
		return oVizFrame;
	}
});
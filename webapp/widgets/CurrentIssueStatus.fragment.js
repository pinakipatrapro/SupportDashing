sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.CurrentIssueStatus", {
	createContent: function(oController) {
		return new sap.ui.core.HTML({
			layoutData : new sap.ui.layout.GridData({
				span:"L8 M12 S12"
			}),
			content: '<canvas id="idCurrentStatusChart" height="800px"  width="800px"></canvas>'
		});
	}
});
sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.IssuesOverPastWeek", {
	createContent: function(oController) {
		return new sap.ui.core.HTML({
			layoutData : new sap.ui.layout.GridData({
				span:"L4 M12 S12"
			}),
			content: '<canvas id="idIssuesOverPastWeek"  height="200px"></canvas>'
		});
	}
});
sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.IssuesOverPastWeek", {
	createContent: function(oController) {
		return new sap.ui.core.HTML({
			layoutData : new sap.ui.layout.GridData({
				span:"L6 M12 S12"
			}),
			content: '<canvas id="idIssuesOverPastWeek"  height="150px"></canvas>'
		});
	}
});
sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.CurrentIssueStatus", {
	createContent: function(oController) {
		return new sap.ui.core.HTML({
			content: '<canvas id="idCurrentStatusChart" height="60px"></canvas>'
		});
	}
});
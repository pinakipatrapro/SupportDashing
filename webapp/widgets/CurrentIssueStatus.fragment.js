sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.CurrentIssueStatus", {
	createContent: function(oController) {
		return new sap.ui.core.HTML({
			content: '<canvas id="idCurrentStatusChart" width="2000px" height="500px"></canvas>'
		});
	}
});
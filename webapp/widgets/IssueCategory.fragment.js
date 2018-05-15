sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.IssueCategory", {
	createContent: function(oController) {
		return new sap.ui.core.HTML({
			layoutData : new sap.ui.layout.GridData({
				span:"L4 M12 S12"
			}),
			content: '<canvas id="idIssueCategory"  height="200px"></canvas>'
		});
	}
});
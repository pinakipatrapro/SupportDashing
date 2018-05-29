sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.MPTAlert", {
	createContent: function(oController) {
		return new sap.ui.core.HTML({
			layoutData : new sap.ui.layout.GridData({
				span:"L4 M12 S12"
			}),
			content: '<canvas id="idMPTAlert"  width="500px" height="250px"></canvas>'
		});
	}
});
sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.IRTAlert", {
	createContent: function(oController) {
		return new sap.ui.core.HTML({
			layoutData : new sap.ui.layout.GridData({
				span:"L4 M12 S12"
			}),
			content: '<canvas id="idIRTAlert"  height="150px"></canvas>'
		});
	}
});
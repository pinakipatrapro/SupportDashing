sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController",
	"pinaki/sap/com/SupportDashing/widgets/CurrentIssueStatusController"
], function(BaseController,CurrentIssueStatusController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.controller.Dashboard", {
		onAfterRendering : function(){
			this.loadData().then(function(){
				new CurrentIssueStatusController().loadChart(this.getView().getModel(),"idCurrentStatusChart");
			}.bind(this));
		}
	});
});
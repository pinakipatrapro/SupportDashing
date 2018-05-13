sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController",
	"pinaki/sap/com/SupportDashing/widgets/CurrentIssueStatusController",
	"pinaki/sap/com/SupportDashing/widgets/IssuesOverPastWeekController"
], function(BaseController,CurrentIssueStatusController,IssuesOverPastWeekController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.controller.Dashboard", {
		onAfterRendering : function(){
			this.loadData().then(function(){
				new CurrentIssueStatusController().loadChart(this.getView().getModel(),"idCurrentStatusChart");
				new IssuesOverPastWeekController().loadChart(this.getView().getModel(),"idIssuesOverPastWeek");
			}.bind(this));
		}
	});
});
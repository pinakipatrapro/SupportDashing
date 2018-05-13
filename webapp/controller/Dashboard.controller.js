sap.ui.define([
	"pinaki/sap/com/SupportDashing/controller/BaseController",
	"pinaki/sap/com/SupportDashing/widgets/CurrentIssueStatusController",
	"pinaki/sap/com/SupportDashing/widgets/IssuesOverPastWeekController",
	"pinaki/sap/com/SupportDashing/widgets/IRTAlertController",
	"pinaki/sap/com/SupportDashing/widgets/IssueCategoryController",
], function(BaseController,CurrentIssueStatusController,IssuesOverPastWeekController,IRTAlertController,IssueCategoryController) {
	"use strict";

	return BaseController.extend("pinaki.sap.com.SupportDashing.controller.Dashboard", {
		onAfterRendering : function(){
			this.loadData().then(function(){
				new CurrentIssueStatusController().loadChart(this.getView().getModel(),"idCurrentStatusChart");
				new IssuesOverPastWeekController().loadChart(this.getView().getModel(),"idIssuesOverPastWeek");
				new IRTAlertController().loadChart(this.getView().getModel(),"idIRTAlert");
				new IssueCategoryController().loadChart(this.getView().getModel(),"idIssueCategory");
			}.bind(this));
		}
	});
});
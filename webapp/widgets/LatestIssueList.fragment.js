sap.ui.jsfragment("pinaki.sap.com.SupportDashing.widgets.LatestIssueList", {
	createContent: function(oController) {
		return new sap.m.List({
			layoutData : new sap.ui.layout.GridData({
				span:"L6 M12 S12"
			}),
			headerText : 'Latest Issues (Very High/High/Medium)',
			items : [
				new sap.m.StandardListItem({title : 'XX-PROJ-CDP-630-RCM : Job failed because of SQL message: general error: temp index not exists',icon:"sap-icon://add"}),
				new sap.m.StandardListItem({title : 'abasis lis ds ksd noiwnde dsod soisd dlsdni',icon:"sap-icon://add"}),
				new sap.m.StandardListItem({title : 'abasis lis ds ksd noiwnde dsod soisd dlsdni',icon:"sap-icon://add"}),
				new sap.m.StandardListItem({title : 'abasis lis ds ksd noiwnde dsod soisd dlsdni',icon:"sap-icon://add"}),
				new sap.m.StandardListItem({title : 'abasis lis ds ksd noiwnde dsod soisd dlsdni',icon:"sap-icon://add"}),
				new sap.m.StandardListItem({title : 'abasis lis ds ksd noiwnde dsod soisd dlsdni',icon:"sap-icon://add"})
			]
		});
	}
});
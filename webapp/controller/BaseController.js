sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	this.apiDetails = {
		customer : {
			url : "https://support.wdf.sap.corp/sap/bc/devdb/customer_incid",
			parameters : "customer"
		},
		search : {
			url : "https://support.wdf.sap.corp/sap/bc/devdb/saved_search",
			parameters : "search_id"
		}
	};
	this.dataCustSearch=[
		{type:"customer",value:"314472"},
		{type:"search",value:"0090FAE68ED01ED7B8CB249B5FB240D3"}
	];
	return Controller.extend("pinaki.sap.com.SupportDashing.controller.BaseController", {
		
	});
});
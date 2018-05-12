sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel"
], function(Controller, JSONModel) {
	"use strict";
	var apiDetails = {
		customer: {
			url: "support.wdf.sap.corp/sap/bc/devdb/customer_incid",
			parameters: "customer"
		},
		search: {
			url: "support.wdf.sap.corp/sap/bc/devdb/saved_search",
			parameters: "search_id"
		}
	};
	var dataCustSearch = [{
		type: "customer",
		value: "314472"
	}, {
		type: "customer",
		value: "287386"
	}, {
		type: "search",
		value: "0090FAE68ED01ED7B8CB249B5FB240D3"
	}];
	var statusKey = {
		NEW : "E0001",
		INPROCESS : "E0002"
	};
	return Controller.extend("pinaki.sap.com.SupportDashing.controller.BaseController", {
		onAfterRendering: function() {
			var aCurrentIssuePromise = this.createCurrentIssueSearchString();
			Promise.all(aCurrentIssuePromise).then(function(e) {
				this.processCurrentIssueData(e);
			}.bind(this)).catch(function(e) {
				this.processCurrentIssueData(e);
			}.bind(this));
		},
		createCurrentIssueSearchString: function() {
			var aSearchString = [];
			dataCustSearch.forEach(function(e) {
				var url = apiDetails[e.type].url + "?" + apiDetails[e.type].parameters + "=" + e.value;
				aSearchString.push(
					this.createAjaxRequest({
						url: url,
						type: "GET"
					})
				);
			}.bind(this));
			return aSearchString;
		},
		createAjaxRequest: function(options) {
			return new Promise(function(resolve, reject) {
				$.ajax({
					type: options.type,
					url: "https://" + options.url + "&format=json",
					async: true,
					dataType: "json",
					success: function(response) {
						resolve(response);
					},
					error: function(response) {
						reject(response);
					}
				});
			});
		},
		processCurrentIssueData: function(aData) {
			var aCurrentIssueData = [];
			aData.forEach(function(e) {
				aCurrentIssueData = aCurrentIssueData.concat(e.DATA);
			});
			this.groupByCustomer(aCurrentIssueData);
		},
		groupByCustomer: function(aCurrentIssueData) {
			//Move logic to web Worker to improve performance
			var aDistinctCustomer = [];
			var aNewStatus = [];
			var aInProcessStatus = [];
			var currentIssueByCustomer = [];
			//Remove Duplicate Entries
			for (var i = 0; i < aCurrentIssueData.length; ++i) {
				for (var j = i + 1; j < aCurrentIssueData.length; ++j) {
					if (aCurrentIssueData[i] === aCurrentIssueData[j])
						aCurrentIssueData.splice(j--, 1);
				}
			}
			aCurrentIssueData.forEach(function(e) {
				if(aDistinctCustomer.indexOf(e.CUST_NAME) < 0 ){
					aDistinctCustomer.push(e.CUST_NAME);
				}
				var index = aDistinctCustomer.indexOf(e.CUST_NAME);
				if(e.STATUS_KEY === statusKey.NEW){
					if(!aNewStatus[index]){aNewStatus[index] = 0;}
					aNewStatus[index] = aNewStatus[index] + 1;
				}else if(e.STATUS_KEY === statusKey.INPROCESS){
					if(!aInProcessStatus[index]){aInProcessStatus[index] = 0;}
					aInProcessStatus[index] = aInProcessStatus[index] + 1;
				}
			});
			for(var k =0;k<aDistinctCustomer.length;k++){
				currentIssueByCustomer.push({
					customerName : aDistinctCustomer[k],
					newIssue : aNewStatus[k],
					inProcessIssue : aInProcessStatus[k]
				});
			}
			return currentIssueByCustomer;
		}
	});
});
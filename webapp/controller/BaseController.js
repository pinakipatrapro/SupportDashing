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
	var dataCustSearch = [
		{
			type: "customer",
			value: "314472"
		}, {
			type: "customer",
			value: "287386"
		}, {
			type: "customer",
			value: "186849"
		}, {
			type: "customer",
			value: "1688831"
		}, {
			type: "customer",
			value: "0001034417"
		}, {
			type: "customer",
			value: "0001011896"
		}, {
			type: "customer",
			value: "0000026075"
		}, {
			type: "customer",
			value: "1372500"
		}/*,{
			type: "search",
			value: "0090FAE68C681ED895BEFA93B41080D4"
		}*/
	];
	var statusKey = {
		NEW: "E0001",
		INPROCESS: "E0002"
	};
	return Controller.extend("pinaki.sap.com.SupportDashing.controller.BaseController", {
		loadData: function() {
			return new Promise(function(resolve, reject) {
				var aCurrentIssuePromise = this.createCurrentIssueSearchString();
				Promise.all(aCurrentIssuePromise).then(function(e) {
					this.processCurrentIssueData(e);
					resolve();
				}.bind(this)).catch(function(e) {
					reject();
				}.bind(this));
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
			var groupedCustomerData = this.groupByCustomer(aCurrentIssueData);
			this.getView().getModel().setData({
				"currentIssueByCustomer": groupedCustomerData
			}, true);
		},
		getDistinctIssues: function(aCurrentIssueData) {
			//Remove Duplicate Entries
			for (var i = 0; i < aCurrentIssueData.length; ++i) {
				for (var j = i + 1; j < aCurrentIssueData.length; ++j) {
					if (aCurrentIssueData[i] === aCurrentIssueData[j])
						aCurrentIssueData.splice(j--, 1);
				}
			}
			this.groupByDate(aCurrentIssueData);
			this.getIrtAlert(aCurrentIssueData);
			this.getMptAlert(aCurrentIssueData);
			this.incidentCategory(aCurrentIssueData);
			return aCurrentIssueData;
		},
		groupByCustomer: function(aCurrentIssueData) {
			//Move logic to web Worker to improve performance
			var aDistinctCustomer = [];
			var aDistinctCategory = [];
			var aNewStatus = [];
			var aInProcessStatus = [];
			var aPriorityKey = [];
			aCurrentIssueData = this.getDistinctIssues(aCurrentIssueData);
			aCurrentIssueData.forEach(function(e) {
				if (aDistinctCategory.indexOf(e.CATEGORY) < 0) {
					if (e.STATUS_KEY === statusKey.NEW || e.STATUS_KEY === statusKey.INPROCESS) {
						aDistinctCategory.push(e.CATEGORY);
						aDistinctCustomer.push(e.CUST_NAME);
					}
					aNewStatus.push(0);
					aInProcessStatus.push(0);
				}
				var index = aDistinctCategory.indexOf(e.CATEGORY);
				if (e.STATUS_KEY === statusKey.NEW) {
					if (!aNewStatus[index]) {
						aNewStatus[index] = 0;
					}
					aNewStatus[index] = aNewStatus[index] + 1;
				} else if (e.STATUS_KEY === statusKey.INPROCESS) {
					if (!aInProcessStatus[index]) {
						aInProcessStatus[index] = 0;
					}
					aInProcessStatus[index] = aInProcessStatus[index] + 1;
				}
				//Set Priority Status
				if (!aPriorityKey[index]) {
					aPriorityKey[index] = {
						"veryHigh": 0,
						"high": 0,
						"medium": 0,
						"low": 0
					};
				}
				if (e.STATUS_KEY === statusKey.INPROCESS || e.STATUS_KEY === statusKey.NEW) {
					if (e.PRIORITY_KEY === "1") {
						aPriorityKey[index]["veryHigh"] = aPriorityKey[index]["veryHigh"] + 1;
					} else if (e.PRIORITY_KEY === "3") {
						aPriorityKey[index]["high"] = aPriorityKey[index]["high"] + 1;
					} else if (e.PRIORITY_KEY === "5") {
						aPriorityKey[index]["medium"] = aPriorityKey[index]["medium"] + 1;
					} else if (e.PRIORITY_KEY === "9") {
						aPriorityKey[index]["low"] = aPriorityKey[index]["low"] + 1;
					}

				}
			});
			var oDistinctCustomer = [];
			for (var l = 0; l < aDistinctCategory.length; l++) {
				oDistinctCustomer.push({
					category: aDistinctCategory[l],
					inProcessStatus: aInProcessStatus[l],
					newStatus: aNewStatus[l],
					priorityKey: aPriorityKey[l],
					customer: aDistinctCustomer[l]
				});
			}
			return oDistinctCustomer;
		},
		groupByDate: function(aCurrentIssueData) {
			//Move logic to web Worker to improve performance
			//Filter issues created this week
			var aIssuesOverPastWeek = [];
			var pastWeek = new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().slice(0, 10).replace(/-/g, "") + "000000";
			aCurrentIssueData.forEach(function(e) {
				if (e.CREATE_DATE > pastWeek) {
					aIssuesOverPastWeek.push(e);
				}
			});
			//Group By Customer
			var groupedIssuesByCustomer = {};
			aIssuesOverPastWeek.forEach(function(e) {
				if (!groupedIssuesByCustomer[e.CUST_NAME]) {
					groupedIssuesByCustomer[e.CUST_NAME] = [];
				}
				groupedIssuesByCustomer[e.CUST_NAME].push(e);
			});
			//Structur for display
			var aDistinctCustomer = [];
			var aCount = [];
			Object.keys(groupedIssuesByCustomer).forEach(function(key, index) {
				aDistinctCustomer.push(key);
				aCount.push(groupedIssuesByCustomer[key].length);
			});
			for (var l = 0; l < aDistinctCustomer.length; l++) {
				aDistinctCustomer[l] = aDistinctCustomer[l].split(' ').join('\n');
			}
			this.getView().getModel().setData({
				"issuesOverPastWeek": {
					aDistinctCustomer: aDistinctCustomer,
					aCount: aCount
				}
			}, true);
		},
		getIrtAlert: function(aCurrentIssueData) {
			var aExpiringIRT = [];
			var currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "") + "000000";
			aCurrentIssueData.forEach(function(e) {
				if (e.IRT_FUL === 0 && e.IRT_EXPIRY > currentDate && e.STATUS_KEY === statusKey.NEW) {
					aExpiringIRT.push(e);
				}
			});
			//Group By Customer
			var groupedIssuesByCustomer = {};
			aExpiringIRT.forEach(function(e) {
				if (!groupedIssuesByCustomer[e.CUST_NAME]) {
					groupedIssuesByCustomer[e.CUST_NAME] = [];
				}
				groupedIssuesByCustomer[e.CUST_NAME].push(e);
			});
			var aDistinctCustomer = [];
			var aCount = [];
			Object.keys(groupedIssuesByCustomer).forEach(function(key, index) {
				aDistinctCustomer.push(key);
				aCount.push(groupedIssuesByCustomer[key].length);
			});
			for (var l = 0; l < aDistinctCustomer.length; l++) {
				aDistinctCustomer[l] = aDistinctCustomer[l].split(' ').join('\n');
			}
			this.getView().getModel().setData({
				"expiringIRT": {
					aDistinctCustomer: aDistinctCustomer,
					aCount: aCount
				}
			}, true);
		},
		getMptAlert: function(aCurrentIssueData) {
			var aExpiringMPT = [];
			var currentDate = new Date().toISOString().slice(0, 10).replace(/-/g, "") + "000000";
			aCurrentIssueData.forEach(function(e) {
				if (e.MPT_EXPIRY > currentDate) {
					aExpiringMPT.push(e);
				}
			});
			//Group By Customer
			var groupedIssuesByCustomer = {};
			aExpiringMPT.forEach(function(e) {
				if (!groupedIssuesByCustomer[e.CUST_NAME]) {
					groupedIssuesByCustomer[e.CUST_NAME] = [];
				}
				groupedIssuesByCustomer[e.CUST_NAME].push(e);
			});
			var aDistinctCustomer = [];
			var aCount = [];
			Object.keys(groupedIssuesByCustomer).forEach(function(key, index) {
				aDistinctCustomer.push(key);
				aCount.push(groupedIssuesByCustomer[key].length);
			});
			for (var l = 0; l < aDistinctCustomer.length; l++) {
				aDistinctCustomer[l] = aDistinctCustomer[l].split(' ').join('\n');
			}
			this.getView().getModel().setData({
				"expiringMPT": {
					aDistinctCustomer: aDistinctCustomer,
					aCount: aCount
				}
			}, true);
		},
		incidentCategory: function(aCurrentIssueData) {
			var aCategories = ["Very High", "High", "Medium", "Low"];
			var aCount = [0, 0, 0, 0];
			aCurrentIssueData.forEach(function(e) {
				switch (e.PRIORITY_KEY) {
					case "1":
						aCount[0] = aCount[0] + 1;
						break;
					case "3":
						aCount[1] = aCount[1] + 1;
						break;
					case "5":
						aCount[2] = aCount[2] + 1;
						break;
					case "9":
						aCount[3] = aCount[3] + 1;
						break;
				}
			});
			this.getView().getModel().setData({
				"issueCategory": {
					aCategories: aCategories,
					aCount: aCount
				}
			}, true);
		},
		sortByPriority: function(aCurrentIssueData) {
			aCurrentIssueData = aCurrentIssueData.sort(function(a, b) {
				return (a.CREATE_DATE < b.CREATE_DATE) ? 1 : ((b.CREATE_DATE > a.CREATE_DATE) ? -1 : 0);
			});

		}
	});
});
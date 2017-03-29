//var chrtApp = angular.module('dashboardApp',['ngMaterial', 'ngMessages', 'material.svgAssetsCache'])
var TableCtrl = dashboardApp.controller('TableCtrl', function($scope, $http, $filter, $parse, $compile, filteredListService,xmlBeautifyService, restService, commonUtils, $rootScope, $log , $window,$mdDialog) {

    // --------------------------------------- Variable declaration Starts--------------------------------------------------
	$scope.tableordetails = true;
	$scope.viewEdit = true;
    $scope.loader = {loading: false,};
    $scope.pageSize = 15;
    $scope.reverse = false;
    $scope.showXML = false;
    $scope.totalPage = 0;
    $scope.selectedRow = -99; // nothing is selected in the begining
    jq = $.noConflict();
    $scope.from = 0;
	$scope.selectedItem = -99;
    $scope.to = 0;
    var rownum = 0;
	$scope.customFullscreen = false;
	$scope.fetchCount = 1000;
    $scope.maxUniqueFetched = 0;
	$scope.minUniqueFetched = 0;
    $scope.clearAllVariable = function() {
        $scope.allItems1 = "";
    	$scope.maxUniqueFetched = 0;
		$scope.minUniqueFetched = 0;
        $scope.allItems = "";
        $scope.headers = "";
        $scope.maxUniqueKey = "";
        $scope.minUniqueKey = "";
        $scope.headersDataType = "";
        $scope.filteredList = "";
        $scope.filteredListTemp = "";
        $scope.ItemsByPage = "";
        $scope.indentXMLData = "";
        $scope.showXML = false;
		$scope.from = 0;
		$scope.to = 0;
		$scope.autoFetch = false;
		$scope.tableordetails = true;
		$scope.viewEdit = true;
		 $scope.selectedRow = -99;
            $scope.indentXMLData = "";
            $scope.showCRUDBtns = false;
    }
    $scope.clearAllVariable();
    $scope.autoFetch = false;
    // --------------------------------------- Variable declaration Ends --------------------------------------------------
    
    $scope.refreshView = function() {
        console.log("Entering into refreshAll function");
        fetchDataFromServerInJSON();
    }

	$scope.getXMLDataFromBlob = function(seqno) {
    	$scope.loader.loading = true;
		if ($scope.tableName == 	'testdashboard_reports'){
        	var getXML = "select reportfile from testdashboard_reports where seqno =" + seqno;
        	restService.fireGet('/fetchblob/' + getXML).success(function(data) {
            	$scope.xmlData = data;
            	$scope.loader.loading = false;
            	$scope.indentXMLData = xmlBeautifyService.prettify($scope.xmlData[0].XMLData, 2);
            	$scope.showXML = true;
        		});
		}
    }

    $scope.fetchDataFromServerInJSON = function() {
		$log.info("Entering into fetchDataFromServerInJSON");
		$scope.prepareRange();
        $http.get('/fetchjsonfromtable/' + $scope.tableName + '/' + $scope.from + '/' + $scope.to + '/' + rownum).then(function(response) {
            if ($scope.autoFetch) { // fetch next data from db when last page comes
                $scope.allItems1 = response.data;
				$log.debug(" In autoFetch if : Previous data count " + $scope.allItems.length);
                $scope.allItems = $scope.allItems.concat(response.data);
				$log.info("Total row is view " + $scope.allItems.length);
            } else {
                $scope.allItems = response.data;
                $scope.loader.loading = false;
            }
            // Get max value of unique key
            $scope.maxUniqueFetched = $scope.allItems[0][$scope.selectionKey];
			$scope.minUniqueFetched = $scope.allItems[$scope.allItems.length- 1][$scope.selectionKey];
           // console.log("$scope.minUniqueFetched = " + $scope.minUniqueFetched +" & " +"$scope.maxUniqueFetched = "+$scope.maxUniqueFetched);
            $scope.sort('none');
        });
    }
    $scope.fetchNextData = function() {
		$scope.autoFetch = true;
        $log.info("Entering into scope.fetchNextData function");
        if ($scope.minUniqueFetched == $scope.minUniqueKey) 
		{
            $log.debug("All data has been fetched");
        } 
		else 
		{
            $scope.fetchDataFromServerInJSON();
        }
    }
	$scope.prepareRange = function()
	{
		if ($scope.autoFetch == false)
		{
			$log.debug("$sccope.maxUniqueKey = "+$scope.maxUniqueKey);
			$log.debug("scope.fetchCount = "+$scope.fetchCount);
			$scope.from = $scope.maxUniqueKey - $scope.fetchCount;
			$log.debug("from "+ $scope.from);
			if ($scope.from < 0)
			{
				$scope.from = 1;	
			}
			$scope.to = $scope.maxUniqueKey;
		}
		else
		{
			$scope.from = $scope.minUniqueFetched - $scope.fetchCount;
			if ($scope.from < 0)
			{
				$scope.from = 1;	
			}
			$scope.to = $scope.minUniqueFetched -1;
		}
	}
    $scope.getMinMaxUniqueKey = function() {
			$log.info("Entering into getMinMaxUniqueKey function"+$scope.selectionKey);
            var queryMaxUK = "select max(" + $scope.selectionKey + ")max from " + $scope.tableName;
            
			restService.fireGet('/fetchjsonfromquery/' + queryMaxUK).success(function(data) {
                $scope.maxUniqueKey = data[0].max;
            	
				var queryMinUK = "select min(" + $scope.selectionKey + ")min from " + $scope.tableName;
            	restService.fireGet('/fetchjsonfromquery/' + queryMinUK).success(function(data) {
                	$scope.minUniqueKey = data[0].min;
		        	$scope.fetchDataFromServerInJSON();
            	});
            });
        }
    //Below function will be called from dashboard controller, dashboard controller will pass table name as argument 
    $rootScope.$on("callViewDetailforData", function(event, viewTableName) {
        $scope.clearAllVariable();
        $scope.tableName = viewTableName;

        $scope.loader.loading = true;
    // function to select row on click
    $scope.toggleSelection = function(sObj, index) {
        if ($scope.selectedRow == sObj[$scope.selectionKey]){
            $scope.selectedRow = -99;
			$scope.indentXMLData = "";
			$scope.showCRUDBtns = false;
		}
        else {
            $scope.showXML = false;
			$scope.showCRUDBtns = true;
			$scope.selectedObject = sObj;
			$log.debug("Selected Obj = "+ JSON.stringify($scope.selectedObject,4)); 
            $scope.selectedRow = sObj[$scope.selectionKey];
			$log.debug("$scope.selectionKey = "+$scope.selectionKey);$log.debug("$scope.selectedRow" + $scope.selectedRow);
            $log.debug("selected row is = " + JSON.stringify(sObj));
           	$scope.getXMLDataFromBlob(sObj.seqno);
        }

    }

		//--------------------------- Get Table inforation for table_reporting_details set starts ---------------------------------------------

        // Get unique_key from table set up for selection on grid
        var selectionKeyQuery = "select distinct unique_key as selectionkey from table_reporting_details where table_name = '" + viewTableName + "';";
        restService.fireGet('/fetchjsonfromquery/' + selectionKeyQuery).success(function(data) {
            $scope.selectionKey = data[0].selectionkey.toLowerCase();
            $scope.getMinMaxUniqueKey();
        });

        //Get header sequnece from table set up
        var selectColumnSeq = " select column_alias header from Table_Reporting_Details where table_name = '" + viewTableName + "' and show_column = 'Y' order by column_seq;";
        restService.fireGet('/fetchjsonfromquery/' + selectColumnSeq).success(function(data) {


            $scope.headers = data;

            //for (var i = 0; i < $scope.headers.length; i++) {
            //    var srchHdr = "search" + $scope.headers[i].header;
           //     var parsesrchHdr = $parse(srchHdr);
           //     //$log.debug("srchHdr " + srchHdr);
           // }
        });

		var selectGroupID = " select group_id,column_alias header from Table_Reporting_Details where table_name = '" + viewTableName + "' and show_column = 'Y' order by group_id;";
        restService.fireGet('/fetchHeaderJson/' + selectGroupID).success(function(data) {


            $scope.headersGroup = data;
			$log.debug("kuldeep --> "+ JSON.stringify($scope.headersGroup,null,4));
			$log.debug("Header Group Length -->"+ $scope.headersGroup.Header.length);
			$scope.headersGroupNew = $scope.headersGroup.Header;
			$log.debug("$scope.headersGroupNew"+$scope.headersGroupNew);
			for (var i = 0;i <  $scope.headersGroup.Header.length; i++)
			{
  				$log.debug("Header Groupwise-->" +$scope.headersGroup.Header[i]);
				var temp = $scope.headersGroup.Header[i];
				for(var j = 0;j <  temp.length; j++)
				{
					$log.debug("Header Groupwise Columns-->" +temp[j]);
				}
			} 
        });

		//Get column eligible for advance search
        var getSearchEligColumn  = " select column_alias header from Table_Reporting_Details where table_name = '" + viewTableName + "' and show_column = 'Y' and search_on ='Y' order by column_seq;";
		restService.fireGet('/fetchjsonfromquery/' + getSearchEligColumn).success(function(data) {
            $scope.advanceSearchColumns = data;
			$log.debug("$scope.advanceSearchColumns"+JSON.stringify($scope.advanceSearchColumns));
            $scope.renderColumnWiseSearch($scope.advanceSearchColumns);
            for (var i = 0; i < $scope.advanceSearchColumns.length; i++) {
                var srchHdr = "search" + $scope.advanceSearchColumns[i].header;
                var parsesrchHdr = $parse(srchHdr);
            }
            
        });
		

        // Get datatype for headers from table set up, datatype is required while searching 
        var getDataType = "select column_alias header,column_datatype header_datatype from table_reporting_details where table_name ='" + viewTableName + "';";
        restService.fireGet('/fetchjsonfromquery/' + getDataType).success(function(data) {
            $scope.headersDataType = data;
            //$log.debug("Header data type  = " + JSON.stringify($scope.headersDataType));
            //create runtime scope vaiable for datatype

            for (var i = 0; i < $scope.headersDataType.length; i++) {
                var tmpDataType = "dataType" + $scope.headersDataType[i].header;
                var parsedt = $parse(tmpDataType);
                parsedt.assign($scope, $scope.headersDataType[i].header_datatype);
            }
        });

		//--------------------------- end ---------------------------------------------
//        $scope.fetchDataFromServerInJSON();
    });

    $scope.resetAll = function() {
        $log.debug("Entering into resetAll function");
        $scope.filteredList = $scope.allItems;

        if ($scope.autoFetch == false) {
            $log.info("resets currentPage to 1");
            $scope.currentPage = 0;
        }
    }

    //------------------------------------------------------------------ Sorting Code Starts ------------------------------------------------------------------------------------------------
    $scope.sort = function(sortBy) {
        console.log("Entering into sort(" + sortBy + ") function ");
        $scope.resetAll();

        for (var i = 0; i < $scope.headers.length; i++) {
            var dynamicStr = "upDown." + $scope.headers[i].header;
            var model = $parse(dynamicStr);
            model.assign($scope, 'na');
        }

        $scope.columnToOrder = sortBy;

        if (sortBy == 'none')
            $log.info("No sorting required");
        else
            $scope.filteredList = $filter('orderBy')($scope.filteredList, $scope.columnToOrder, $scope.reverse);

        if ($scope.reverse) {
            iconName = 'fa fa-sort-asc';
        } else {
            iconName = 'fa fa-sort-desc';
        }

        var dynamicStr1 = "upDown." + sortBy;
        var model = $parse(dynamicStr1);
        model.assign($scope, iconName);
        $scope.reverse = !$scope.reverse;
        if ($scope.autoFetch == false) {
            $scope.pagination();
        } else {
            $scope.searchOn();
        }
    };
    //------------------------------------------------------------------ Sorting Code Ends ------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------ Searching Code Starts ------------------------------------------------------------------------------------------------
    //render column wise search
    $scope.renderColumnWiseSearch = function(hdrList) {
        jq('#columnWiseSearch').empty();
        var tmplt = '';
        for (var i = 0; i < hdrList.length; i++) {
            tmplt += '<div class="col-xs-3"> <input class="form-control" ng-model="search' + hdrList[i].header + '"  placeholder="Search ' + hdrList[i].header + '" type="search" ng-change="searchOn()" /></div> ';
        }
        var $el = jq(tmplt).appendTo('#columnWiseSearch');
        $compile($el)($scope);
    }
	// WildCard Search
    $scope.search = function(searchData) {
        $scope.filteredList = $filter('filter')($scope.allItems, searchData);
        $scope.pagination();
    };
	// Column wise search
    $scope.searchOn = function() {
        // search on bind varaible of the columns one by one
        $scope.allItemsTemp = $scope.allItems;
		$log.debug("In searchOn function $scope.allItems "+$scope.allItems.length);
        $scope.filteredListTemp = '';
		var searchChk=0;
        for (var i = 0; i < $scope.advanceSearchColumns.length; i++) {
            $log.debug("Searching on "+$scope.advanceSearchColumns[i].header+" for data "+$scope['search'+$scope.advanceSearchColumns[i].header]);
            if (typeof $scope['search' + $scope.advanceSearchColumns[i].header] != 'undefined') {
				searchChk = 1;

                $scope.filteredListTemp = filteredListService.searched($scope.allItemsTemp, $scope.advanceSearchColumns[i].header, $scope['search' + $scope.advanceSearchColumns[i].header], $scope['dataType' + $scope.advanceSearchColumns[i].header]);
                $scope.allItemsTemp = $scope.filteredListTemp;
            }
        }
		if(searchChk ==1 ){
        	$scope.filteredList = $scope.filteredListTemp;
        }
		$scope.pagination();
    };
    //------------------------------------------------------------------ Searching Code Ends ------------------------------------------------------------------------------------------------
    //------------------------------------------------------------------ Pagination Code Starts ------------------------------------------------------------------------------------------------
    $scope.pagination = function() {
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
        $scope.totalPage = $scope.ItemsByPage.length;
        $scope.paginationButtons();
    };

    $scope.paginationButtons = function() {
        var crntPage = $scope.currentPage + 1;
        $log.debug("Entering into paginationButtons function: current page = " + crntPage + " & Total Page = " + $scope.totalPage);
        if ($scope.totalPage == 1 || $scope.totalPage == 0) {
            $scope.hidePrevLi = true;
            $scope.hideNextLi = true;
            $scope.hideFirstLi = true;
            $scope.hideLastLi = true;
        } else if (crntPage == 1) {
            $scope.hidePrevLi = true;
            $scope.hideNextLi = false;
            $scope.hideFirstLi = true;
            $scope.hideLastLi = false;
        } else if (crntPage == $scope.totalPage) {
            $scope.hidePrevLi = false;
            $scope.hideNextLi = true;
            $scope.hideFirstLi = false;
            $scope.hideLastLi = true;
        } else {
            $scope.hidePrevLi = false;
            $scope.hideNextLi = false;
            $scope.hideFirstLi = false;
            $scope.hideLastLi = false;
        }
        if ($scope.hideLastLi == true && $scope.autoFetch == false) 
		{
			$scope.fetchNextData();
		}
    };

    $scope.nextPage = function() {
        $scope.currentPage = $scope.currentPage + 1;
        $scope.totalPage = $scope.ItemsByPage.length;
        $scope.paginationButtons();
    };

    $scope.prevPage = function() {
        $scope.currentPage = $scope.currentPage - 1;
        $scope.totalPage = $scope.ItemsByPage.length;
        $scope.paginationButtons();
    };

    $scope.firstPage = function() {
        $scope.currentPage = 0;
        $scope.totalPage = $scope.ItemsByPage.length;
        $scope.paginationButtons();
    };

    $scope.lastPage = function() {
        $scope.currentPage = $scope.ItemsByPage.length - 1;
        $scope.totalPage = $scope.ItemsByPage.length;
        $scope.paginationButtons();
    };
 //------------------------------------------------------------------ Pagination Code Ends ------------------------------------------------------------------------------------------------
	$scope.showHideDetails = function(inp) {
    if(inp == true)
	{
	$scope.showHideDtlPanel	= true;
	}
	else
	{
		$scope.showHideDtlPanel = false;
	}

	};

	$scope.saveData = function() {
	$log.debug("value here = " + JSON.stringify($scope.data));	
    };

	$scope.editItem = function (item) {
        $scope.editing = true;
    };

    $scope.doneEditing = function (item) {
        $scope.editing = false;
		$log.debug("After editing "+ JSON.stringify($scope.selectedObject));
		$log.debug("Table Name -->"+ $scope.tableName);
		$log.debug("selectionKey -->"+ $scope.selectionKey);
		//var strJSON = encodeURIComponent(JSON.stringify($scope.selectedObject));
		var strJSON = JSON.stringify($scope.selectedObject);
		var safevaluestrJSON = strJSON.split('.').join('FULLSTOP');
		var safevaluestrJSONnew = safevaluestrJSON.split('/').join('BACKSLASH');
		var safevaluestrJSONFinal = encodeURIComponent(safevaluestrJSONnew);
		$log.debug("strJSON -->"+ strJSON);
		$log.debug("safevaluestrJSON -->"+ safevaluestrJSON);
		$http.get('/updateTable/' + $scope.tableName + '/' + $scope.selectionKey + '/' + safevaluestrJSONFinal).success(function(data) {
        });
    };


//	$scope.viewDetails = function(ev) {
//    	$mdDialog.show({
//		controller: DialogController,
//      	template:
//			'<md-dialog aria-label="List dialog"> <form ng-cloak="true">' +
//		   	'	<md-toolbar> <div class="md-toolbar-tools"> <h2>View Data</h2> <span flex></span> <md-button class="md-icon-button" ng-click="cancel()"> <md-icon md-svg-src="img/icons/ic_close_24px.svg" aria-label="Close dialog"></md-icon> </md-button> </div> </md-toolbar>'+
//           	'  <md-dialog-content><div style="overflow-y: scroll; height:650px;width:1000px">'+
//		   	' 	<div class="table-responsive">' +
//		   	'	<table class=" table table-bordered table-hover table-striped">' +
//			'		<tbody ng-repeat="hdr in hdrs">' +
//            '    		<tr>' +
//            '        		<td >{{hdr.header | uppercase}} </td>' +
//            '        		<td >{{items[hdr.header]}} </td>' +
//            '    		</tr>' +
//            '		</tbody>' +
//           	'    </table>' +
//           	'    </div>' +
//           	' </div> </md-dialog-content>' +
//		   	'<md-dialog-actions layout="row"><span flex></span> <md-button ng-click="hide()" style="margin-right:20px;">Close</md-button></md-dialog-actions>'+
//		   	'</form>'+
//           	'</md-dialog>',
//		parent: angular.element(document.body),
//      	targetEvent: ev,
//      	clickOutsideToClose:true,
//		locals: {
//           items: $scope.selectedObject,
//		   hdrs : $scope.headers
//         },
//      	fullscreen: $scope.customFullscreen
//    	});

//		function DialogController($scope, $mdDialog, items,hdrs) {
//			$scope.items = items;
//			$scope.hdrs = hdrs;
//    		$scope.hide = function() {
//      		$mdDialog.hide();
//    		};

//    		$scope.cancel = function() {
//      		$mdDialog.cancel();
//    		};

//    		$scope.answer = function(answer) {
//      		$mdDialog.hide(answer);
//    		};
// 	 	}
//  };

    $scope.updateData = function(ev) {
	$scope.tableordetails = false;
	$scope.viewEdit = false;
  };

    $scope.viewDetails = function(ev) {
    $scope.tableordetails = false;
	$scope.viewEdit = true;
  };


});


function searchUtil(item, searchColumn, searchData, searchDataType) {
    if (searchDataType == "number") {
        return (item[searchColumn] == searchData) ? true : false;
    }
    if (searchDataType == "varchar" || searchDataType == "date") {
        return (item[searchColumn].indexOf(searchData) > -1) ? true : false;
    }
}

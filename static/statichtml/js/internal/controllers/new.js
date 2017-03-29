var myApp = angular.module('myApp', []);

myApp.service('filteredListService', function () 
{
	var str2="";
    this.searched = function (valLists,dataTypeList, toSearch, searchColumn) 
	{
    	return _.filter(valLists,
        function (i) 
		{
            /* Search Text in all 3 fields */
            return searchUtil(i,dataTypeList, toSearch,searchColumn);
        });
    };

    this.paged = function (valLists, pageSize) 
	{
		//console.log("Entering into function paged");
		//console.log("input argument is : ");
        retVal = [];
        for (var i = 0; i < valLists.length; i++) {
            if (i % pageSize === 0) {
                retVal[Math.floor(i / pageSize)] = [valLists[i]];
            } else {
                retVal[Math.floor(i / pageSize)].push(valLists[i]);
            }
        }
        return retVal;
    };

});

//Inject Custom Service Created by us and Global service $filter. This is one way of specifying dependency Injection
var TableCtrl = myApp.controller('TableCtrl', function ($scope, $http,$filter, filteredListService) 
{
	var urlBase = "";
	var str = "";
	var str1 = "";
	$scope.col1 = $scope.key;
	//$http.defaults.headers.post["Content-Type"] = "application/json";
    $scope.pageSize = 20;
    $scope.reverse = false;
	$scope.totalPage = 0;
	$scope.table = "testrepo";
	$scope.dataType = {"testcaseid":"number","testcasetype":"string","lastexecutedstatus":"string","testcaseflow":"string","modulename":"string","submodule":"string","lastexecuteddatetime":"string","funtionality":"string"};
	
	$scope.setClickedRow = function(sObj,index)
	{
		console.log("selected testcase flow is " + sObj.testcaseid + " :: " + sObj.submodule  + " :: " + sObj.testcasetype   + " :: " + sObj.testcaseflow);
		//console.log("selected index is " + s_testcaseid);	
		$scope.selectedRow = index;
	}
	
	$scope.refreshView = function ()
	{
		console.log("Entering into refreshAll function");
		getAllTestRepos2();
		
	}	
	function getAllTestRepos2() 
	{
		console.log("Entering into- getAllTestRepos(TableCtrl)");
		console.log("$scope.table = " + $scope.table);
        //$http.get('/testrepos').then(function(response)
        $http.get('/fetchjsonfromquery/select * from '+$scope.table).then(function(response)
		{
        	//console.log("Getting DB Data");
        	$scope.allItems =  response.data;
        	$scope.keys =  Object.keys($scope.allItems[0]);
        	//str = JSON.stringify($scope.allItems);
        	////console.log(str);
			 $scope.sort('name');
		});
		////console.log("114");	
	}
 getAllTestRepos2();

	var str3="";
    $scope.resetAll = function () 
	{
//		//console.log("Entering into function resetAll");
//		str3=JSON.stringify($scope.allItems);
//		//console.log(str3);
//		//console.log("scope.allItems = "+str3);
    	$scope.filteredList = $scope.allItems;
    	$scope.searchText = '';
		$scope.searchTextModule = '';
		$scope.searchTextCaseID = '';
		$scope.searchTextCaseType = '';
		$scope.searchTextCaseFlow = '';
    	$scope.currentPage = 0;
    	$scope.Header = ['', '', ''];
    }


    $scope.search = function (searchData,searchColumn) 
	{
		
		
		//console.log("Entering into search function :: " + searchData);
		//console.log("Entering into search searchColumn:: " + searchColumn);
    //	$scope.filteredList = filteredListService.searched($scope.filteredList,$scope.dataType,searchData,searchColumn );
        $scope.filteredList = $filter('filter')($scope.allItems,searchData );
	//	console.log("Entering into search function :: " +  $scope.searchTextCaseID +"::"+ $scope.searchTextModule +"::"+  $scope.searchTextCaseType +"::"+ $scope.searchTextCaseFlow);
    	$scope.pagination();
    }

    // Calculate Total Number of Pages based on Search Result
    $scope.pagination = function () 
	{
	//	console.log("Entering into pagination function");
        $scope.ItemsByPage = filteredListService.paged($scope.filteredList, $scope.pageSize);
		$scope.totalPage = $scope.ItemsByPage.length ;
        //$scope.ItemsByPage = filteredListService.paged($scope.allItems, $scope.pageSize);
    };

   /* $scope.setPage = function () {
		//console.log("Entering into setPage function");
        $scope.currentPage = this.n;
		
    };*/
	$scope.nextPage = function () {
		$scope.currentPage = $scope.currentPage + 1 ;
		$scope.totalPage = $scope.ItemsByPage.length ;
	};
	$scope.prevPage = function () {
		$scope.currentPage = $scope.currentPage - 1 ;
		$scope.totalPage = $scope.ItemsByPage.length ;
	};

    $scope.firstPage = function () {
		//console.log("Entering into firstPage function");
        $scope.currentPage = 0;
		$scope.totalPage = $scope.ItemsByPage.length ;
    };

    $scope.lastPage = function () {
		//console.log("Entering into lastPage function");
        $scope.currentPage = $scope.ItemsByPage.length - 1;
		$scope.totalPage = $scope.ItemsByPage.length ;
    };

    $scope.range = function (input, total) 
	{
	//	console.log("Entering into range function");
		////console.log("In range function input ="+input);
	//	//console.log("In range funciton total ="+total);
        var ret = [];
        if (!total) {
            total = input;
            input = 0;
        }
        for (var i = input; i < total; i++) {
            if (i != 0 && i != total - 1) {
                ret.push(i);
            }
        }
        return ret;
    };
    $scope.sort = function (sortBy) 
	{
		console.log("Entering into sort function" + sortBy);
        $scope.resetAll();

        $scope.columnToOrder = sortBy;

        //$Filter - Standard Service
        $scope.filteredList = $filter('orderBy')($scope.filteredList, $scope.columnToOrder, $scope.reverse);

        if ($scope.reverse) 
		{
			iconName = 'glyphicon glyphicon-chevron-up';
		}
        else 
		{	
			iconName = 'glyphicon glyphicon-chevron-down';
		}
        
		if (sortBy === 'EmpId') 
		{
            $scope.Header[0] = iconName;
        }
		else if (sortBy === 'name') 
		{
            $scope.Header[1] = iconName;
        } 
		else if (sortBy === 'testcaseid')
		{
            $scope.Header[3] = iconName;
        }
		else
		{
			$scope.Header[2] = iconName;
		}

        $scope.reverse = !$scope.reverse;

        $scope.pagination();
    };

    //By Default sort ny Name
   // $scope.sort('name');
});

myApp.directive('productColor', function() {
      return {
          restrict: 'E', //Element Directive
          templateUrl: 'statichtml/product-color'
      };
   }
  );
function searchUtil(item,dataTypeList, toSearch, searchColumn) 
	{
		//console.log("Entering into searchUtil function" + toSearch, searchColumn);
		//console.log("In searchUtil function , dataType = "+ JSON.stringify(dataTypeList));	
		//console.log("In searchUtil function , Items = "+ JSON.stringify(item));	
    	
		//console.log("In SearchUtil Function search datatype var = "+dataTypeList[searchColumn]);
		/* Search Text in all 3 fields */
		if ( dataTypeList[searchColumn] == 'string' )
		{
		//	console.log(" into string if condition");
			return (item[searchColumn].toLowerCase().indexOf(toSearch) > -1) ? true : false;
		}
		if ( dataTypeList[searchColumn] == 'number')
		{
		//	console.log(" into number if condition");
			return (item[searchColumn] == toSearch) ? true : false;
		}



	if (searchColumn == 'testcaseid111')
		{
		console.log("in CaseID IF condition : " + toSearch);
			return (item.testcaseid == toSearch) ? true : false;
		}
		if (searchColumn == 'Module')
		{
	//		console.log("in Module IF condition : " + toSearch);
    		return (item.submodule.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 ) ? true : false;
		}
		if (searchColumn == 'CaseType')
		{
	//		console.log("in CaseType IF condition : " + toSearch);
			return (item.testcasetype.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 ) ? true : false;
		}
		if (searchColumn == 'CaseFlow')
		{
	//		console.log("in CaseFlow IF condition : " + toSearch);
			return (item.testcaseflow.toLowerCase().indexOf(toSearch.toLowerCase()) > -1 ) ? true : false;
		}
	}




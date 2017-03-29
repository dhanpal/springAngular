//var dashboardApp = angular.module('dashboardApp', ['serviceModule','angular.morris-chart']);
dashboardApp.controller('dashboardController', function($scope, $http, $filter, $rootScope,restService,commonUtils,$log ,$mdDialog) {

    $scope.showDashBoard = true;
    $scope.showCharts = false;
    $scope.showViewDetail = false;
	$scope.showViewDetailPanels = false;
	$scope.selectedTab = 0;
    $scope.setDashBoardOn = function() {
		$scope.selectedTab = 1;
        $scope.showDashBoard = true;
        $scope.showCharts = false;
        $scope.showViewDetail = false;
		// Get Market wise statistics data
   		var queryMWS = "select marketscenarios,cntok,cntnok,processingtime,status from testdashboard_mws where rownum < 9";
		restService.fireGet('/fetchjsonfromquery/' + queryMWS).success(function (data){
    		$scope.MWS = data;
    		$scope.headerMWS = Object.keys($scope.MWS[0]);
		});

    	// Get Market Critical Transcation Error data
    	var queryCTE = "select * from testdashboard_cte where rownum < 9";
		restService.fireGet('/fetchjsonfromquery/' + queryCTE).success(function (data){
    		$scope.CTE =data;
    		$scope.headerCTE = Object.keys($scope.CTE[0]);
		});
    
		// Get Market processsing panel data
    	var queryPP = "select * from  testdashboard_pp where rownum < 9";
		restService.fireGet('/fetchjsonfromquery/' + queryPP).success(function (data){
    		$scope.PP = data;
    		$scope.headerPP = Object.keys($scope.PP[0]);
		});
	
	    // Get Cards data
	    var queryCards = "select * from  testdashboard_cards";
		restService.fireGet('/fetchjsonfromquery/' + queryCards).success(function (data){
	    	$scope.Cards = data;
	    	$scope.card1 = $filter('filter')($scope.Cards,{"cardname": 'blue'});
	    	$scope.card2 = $filter('filter')($scope.Cards,{"cardname": 'green'});
	    	$scope.card3 = $filter('filter')($scope.Cards,{"cardname": 'yellow'});
	    	$scope.card4 = $filter('filter')($scope.Cards,{"cardname": 'red'});
		});
	    
		var queryCardsGreen = "select count(*) cnt from  testdashboard_green";
		restService.fireGet('/fetchjsonfromquery/' + queryCardsGreen).success(function (data){
	    	$scope.CardsGreenCount = data[0].cnt;
		});
		var queryCardsYellow = "select count(*) cnt from  testdashboard_yellow";
		restService.fireGet('/fetchjsonfromquery/' + queryCardsYellow).success(function (data){
	    	$scope.CardsYellowCount = data[0].cnt;
		});
		var queryCardsRed = "select count(*) cnt from  testdashboard_Red";
		restService.fireGet('/fetchjsonfromquery/' + queryCardsRed).success(function (data){
	    	$scope.CardsRedCount = data[0].cnt;
		});
    }
   $scope.setDashBoardOn();	
    
	$scope.setViewDetailOn = function(tableName, viewDtlHeader) {
		if(tableName == 'testdashboard_al')
		$scope.selectedTab = 3;
		
		if(tableName == 'testdashboard_em')
		$scope.selectedTab = 4;
        
		if(tableName == 'testdashboard_tcr')
		$scope.selectedTab = 5;
        
		if(tableName == 'testdashboard_tcrm')
		$scope.selectedTab = 6;
    	if(tableName == 'sa_instrn_inp_prod')
		$scope.selectedTab =8;    
       	
		$log.info("$scope.selectedTab = "+$scope.selectedTab);
		$scope.showDashBoard = false;
        $scope.showCharts = false;
        $scope.showViewDetailPanels = false;
        $scope.showViewDetail = true;
        $scope.viewDetailHeader = viewDtlHeader;
        $rootScope.$emit("callViewDetailforData", tableName);
    }
	$scope.setViewDetailPanelsOn = function(tableName, viewDtlHeader) {
       	
		if(tableName == 'testdashboard_reports')
		$scope.selectedTab = 7;
 
		$scope.showDashBoard = false;
        $scope.showCharts = false;
        $scope.showViewDetail = false;
        $scope.showViewDetailPanels = true;
        $scope.viewDetailHeader = viewDtlHeader;
        $rootScope.$emit("callViewDetailforData", tableName);
    }
	
    $scope.setChartsOn = function() {
		$scope.selectedTab = 2;
        $scope.showDashBoard = false;
        $scope.showViewDetail = false;
		$scope.showViewDetailPanels = false;
        $scope.showCharts = true;

		restService.fireGet('/fetchjsonfromquery/select cnt processed ,timemi minutes from bancs_usrfullStopsitpsr order by 2').success(function (data) {
        	$scope.msgReceivedPerMin = data;
        	$scope.msgPerMinChartYkeys = ["processed"];
        	$scope.msgPerMinChartLbls = ["processed"];
        	$scope.msgPerMinChartColors = ["#31C0BE"];
		});
        
		var queryrjtMsgs = "select sum(cnt) cnt, case when intfid in ('TradeProcOut4','TradeProcOut2','TradeProcOut3','TradeProcOut1') then 'BANCSSECIN' when intfid in ('TradeProcIn2','TradeProcIn1','TradeProcIn3','TradeProcIn4') then 'BANCSSECOUT' else intfid end intfid from bancs_usrfullStopsirep where status = 'REJECTED' group by case when intfid in ('TradeProcOut4','TradeProcOut2','TradeProcOut3','TradeProcOut1') then 'BANCSSECIN' when intfid in ('TradeProcIn2','TradeProcIn1','TradeProcIn3','TradeProcIn4') then 'BANCSSECOUT' else intfid end";
		
		restService.fireGet('/fetchjsonfromquery/'+ queryrjtMsgs).success(function (data) {
			$scope.rjtMsgsData = data;
			$scope.rjtMsgsChartXkeys = 'intfid';
        	$scope.rjtMsgsChartYkeys = ["cnt"];
        	$scope.rjtMsgsChartLbls = ["Count"];
        	$scope.rjtMsgsChartColors = ["#e60000"];
		});
        
		var queryPendingMsgs = "select sum(cnt) cnt, intfid from bancs_usrfullStopsirep where status = 'PENDING'  group by intfid order by case when intfid in( 'SWIFTSAG' ) then 1 when intfid in( 'SWIFTMICS' ) then 2 when intfid in( 'SWIFTNAM' ) then 3 when intfid in ('TradeProcIn1','TradeProcIn2','TradeProcIn3','TradeProcIn4') then 4 when intfid in ('TradeProcOut1','TradeProcOut2','TradeProcOut3','TradeProcOut4') then 5 when intfid =  'SWIFTSAGOUT' then 6 when intfid =  'SWIFTMICSOUT' then 6 when intfid =  'SWIFTNAMOUT' then 7 else 9 end";
		restService.fireGet('/fetchjsonfromquery/' + queryPendingMsgs).success(function (data){
            $scope.rjtPendingData = data;
			$scope.PendingMsgsChartXkeys = 'intfid';
        	$scope.PendingMsgsChartYkeys = ["cnt"];
        	$scope.PendingMsgsChartLbls = ["Count"];
        	$scope.PendingMsgsChartColors = ["#31C0BE"];
		});
        
		var queryCA1 = "select starttime , timemi duration from bancs_usrfullStopcaintrarep order by 1";
		restService.fireGet('/fetchjsonfromquery/' + queryCA1).success(function (data){
        	$scope.CA1Data = data;
        	$scope.ca1ChartXkeys = 'starttime';
        	$scope.ca1ChartYkeys = ["duration"];
        	$scope.ca1ChartLbls = ["duration"];
        	$scope.ca1ChartColors = ["#31C0BE"];
		});
        
		var queryCA2 = "select starttime , timemi duration from bancs_usrfullStopcaintra2rep order by 1";
		restService.fireGet('/fetchjsonfromquery/' + queryCA2).success(function (data){
        	$scope.CA2Data = data;
        	$scope.ca2ChartXkeys = 'starttime';
        	$scope.ca2ChartYkeys = ["duration"];
        	$scope.ca2ChartLbls = ["duration"];
        	$scope.ca2ChartColors = ["#31C0BE"];
		});
        
		var queryCSC = "select starttime , timemi duration from bancs_usrfullStopintrarep  order by 1";
		restService.fireGet('/fetchjsonfromquery/' + queryCSC).success(function (data){
        	$scope.CSCData = data;
        	$scope.CSCChartXkeys = 'starttime';
        	$scope.CSCChartYkeys = ["duration"];
        	$scope.CSCChartLbls = ["duration"];
        	$scope.CSCChartColors = ["#31C0BE"];
		});
        
       var queryDonut = "SELECT SUM(cnt) as value, intfid as label FROM bancs_usrfullStopsirep WHERE status = 'PROCESSED' AND intfid NOT IN ('TradeProcIn2','TradeProcIn1','TradeProcIn3','TradeProcIn4','TradeProcOut4','TradeProcOut2','TradeProcOut3','TradeProcOut1') GROUP BY intfid ORDER BY CASE WHEN intfid IN( 'SWIFTSAG') THEN 1 WHEN intfid IN( 'SWIFTMICS' ) THEN 2 WHEN intfid IN( 'SWIFTNAM' ) THEN 3 WHEN intfid IN ('TradeProcIn2','TradeProcIn1','TradeProcIn3','TradeProcIn4') THEN 4 WHEN intfid IN ('TradeProcOut4','TradeProcOut2','TradeProcOut3','TradeProcOut1') THEN 5 WHEN intfid = 'SWIFTSAGOUT' THEN 6 WHEN intfid = 'SWIFTMICSOUT' THEN 6 WHEN intfid = 'SWIFTNAMOUT' THEN 7 ELSE 9 END";
		restService.fireGet('/fetchjsonfromquery/' +queryDonut).success(function (data){
            $scope.donutChartData = data;
       		$scope.donutchartColors = ["#31C0BE", "#c7254e", "#98a0d3"];
		});	
		
		//	 Line Chart SBL
        function sblLineChart() {
            var querySBLLineChart = "select BP_ID Total,as_of_date asofdate from bancs_usrfullStopsbl_incorrect_pos  where to_char(as_of_date,'d' )  not in (6,7) and rownum < 500  order by as_of_date";
            $http.get('/fetchjsonfromquery/' + querySBLLineChart).then(function(response) {
                $scope.sblLineChartData = response.data;
			//	console.log("sbl data is " + JSON.stringify($scope.sblLineChartData));
            });
        }
        $scope.sblLineChartXkeys = 'asofdate';
        $scope.sblLineChartYkeys = ["total"];
        $scope.sblLineChartLbls = ["asofdate"];
        $scope.sblLineChartColors = ["#31C0BE"];
        sblLineChart();
	
    }

	$scope.showAdvanced = function(ev) {
        $mdDialog.show({
            parent: angular.element(document.body),
            targetEvent: ev,
            template: '<md-dialog aria-label="My Dialog">'+
                    '<md-dialog-content class="sticky-container">Blah Blah' +
                    '</md-dialog-content>' +
                    '<md-button ng-click=close()>Close</md-button>' +
                    '</md-dialog>',
            clickOutsideToClose:true,
        });

  };
    
});

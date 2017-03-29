dashboardApp.directive('dashboradTemplate', function() {
    return {
        restrict: 'E', //Element Directive
        templateUrl: 'dashboard'
    };
});

dashboardApp.directive('chartsTemplate', function() {
    return {
        restrict: 'E', //Element Directive
        templateUrl: 'charts'
    };
});

dashboardApp.directive('viewDetails', function() {
    return {
        restrict: 'E', //Element Directive
        templateUrl: 'viewDetail'
    };
});

dashboardApp.directive('viewDetailPanels', function() {
    return {
        restrict: 'E', //Element Directive
        templateUrl: 'viewDetailPanels'
    };
});

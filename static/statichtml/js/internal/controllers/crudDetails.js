var crudActionController = dashboardApp.controller('crudActionController', function($scope, $http, $filter, $parse, $compile, filteredListService,xmlBeautifyService, restService, commonUtils, $rootScope, $log , $window,productService) {

$scope.products = productService.getProducts();
});

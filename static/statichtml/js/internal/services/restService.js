angular.module("serviceModule")
	.factory("restService",function($http) {
		
	return {
		fireGet: function(url, params) 
		{
			return $http({
				url:url,
				mehtod: 'GET',
				async:false,
				cache:false,
				headers:{'Accept': 'application/json;charset=UTF-8', 'Pragma': 'no-cache'},
				params:params
			});
		}
	};
	return {
		firePost: function(url, params) 
		{
			return $http({
				url:url,
				mehtod: 'POST',
				async:false,
				cache:false,
				headers:{'Accept': 'application/json;charset=UTF-8', 'Pragma': 'no-cache'},
				params:params
			});
		}
	};

	});

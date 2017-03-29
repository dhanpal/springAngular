angular.module("serviceModule")
        .factory("commonUtils", function ($http, $log) {
            return {
                isUndefinedOrNullOrEmpty: function (val) {
                    return angular.isUndefined(val) || val === null || val === '';
                },
                handleHttpError: function (error, status) {
                    $log.error("error::"+status);
                //    if (error === 'SESSION_TIMED_OUT') {
                       // alert($translate.instant("sessionExpired"));
                 //   }
                }
            };
        });

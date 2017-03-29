dashboardApp.service('filteredListService', function($log) {

    this.searched = function(valLists, searchColumn, searchData, searchDataType) {
        if (searchDataType == 'number' && searchData == '') {
            return valLists;
        }
        $log.debug("valList length = " + valLists.length);
        $log.debug("Into function searched : " + searchColumn + " : " + searchData + " : " + searchDataType);
        return _.filter(valLists,

            function(i) {
                /* Search Text in all 3 fields */
                return searchUtil(i, searchColumn, searchData, searchDataType);
            });
    };

    this.paged = function(valLists, pageSize) {
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

/*\
title: $:/plugins/oflg/fishing/filters/interval.js
type: application/javascript
module-type: filteroperator

Calculate the interval of tiddler

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    /*
    Export our filter function
    */
    exports.interval = function (source, operator, options) {
        var results = [];
        source(function (tiddler, title) {
            var twTime = title;

            var twTimeDay = $tw.wiki.filterTiddlers("[[" + twTime + "]format:date[YYYY-0MM-0DD]]")[0],
                nowDay = new Date().toISOString().split("T")[0];

            var diffTime = new Date(nowDay) - new Date(twTimeDay);

            var diffDay = diffTime / 86400000 || 0;

            var interval = String(diffDay > 0 ? diffDay : 0);

            results.push(interval);
        });
        return results;
    };

})();

/*\
title: $:/plugins/oflg/fishing/delay.js
type: application/javascript
module-type: filteroperator

Calculate the delay of fish

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    /*
    Export our filter function
    */
    exports.delay = function (source, operator, options) {
        var results = [];
        source(function (tiddler, title) {
            var due = title;

            var Y = due.slice(0, 4);
            var M = due.slice(4, 6);
            var D = due.slice(6, 8);
            var dateDue = Y + "-" + M + "-" + D;
            var dateNow = new Date().toISOString().split("T")[0];
            var diffTime = new Date(dateNow) - new Date(dateDue);

            var delay = Math.abs(diffTime / 86400000) || 0;

            results.push(delay.toString());
        });
        return results;
    };

})();

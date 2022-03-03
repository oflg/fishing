/*\
title: $:/plugins/oflg/fishing/filters/due.js
type: application/javascript
module-type: filteroperator

Calculate the due of tiddler

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    /*
    Export our filter function
    */
    exports.due = function (source, operator, options) {
        var results = [];
        source(function (tiddler, title) {
            var addDay = Number(title) >= 1 ? Number(title) : 1;

            var dateTime = addDay * 86400000 + new Date().getTime();
            var due = new Date(dateTime).toISOString().replace(/-|T|:|\.|Z/g, "");

            results.push(due);
        });
        return results;
    };

})();
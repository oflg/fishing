/*\
title: $:/plugins/oflg/fishing/due.js
type: application/javascript
module-type: filteroperator

Calculate the due of fish

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
            var interval = Number(title) || 0;

            var dateTime = interval * 86400000 + new Date().getTime();
            var due = new Date(dateTime).toISOString().replace(/-|T|:|\.|Z/g, "");

            results.push(due.toString());
        });
        return results;
    };

})();
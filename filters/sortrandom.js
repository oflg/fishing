/*\
Filter operator for return a random title in the list.
\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    /*
    Export our filter function
    */
    exports.sortrandom = function (source, operator, options) {
        var results = [];

        source(function (tiddler, title) {
            results.push(title);
        });

        results = results.sort(function () {
            return Math.random() - 0.5;
        });

        return results;
    };

})();
/*\
title: $:/plugins/oflg/fishing/delay.js
type: application/javascript
module-type: macro
Macro to calculate the day from now to due.
\*/
(function () {
    /*jslint node: true, browser: true */
    /*global $tw: false */

    "use strict";

    exports.name = "delay";
    exports.params = [];

    /*
    Run the macro
    */
    exports.run = function () {
        var title = this.getVariable("currentTiddler");
        var tiddler = this.wiki.getTiddler(title);

        if (tiddler && tiddler.hasField("due")) {
            var due = tiddler.getFieldString("due");

            var Y = due.slice(0, 4);
            var M = due.slice(4, 6);
            var D = due.slice(6, 8);
            var dateDue = Y + "-" + M + "-" + D;
            var dateNow = new Date().toISOString().split("T")[0];
            var diffTime = new Date(dateNow) - new Date(dateDue);

            var result = Math.abs(diffTime / (1000 * 60 * 60 * 24));

        } else {
            var result = "0";
        }
        return result;
    };
})();
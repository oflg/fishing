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
            var lastdue = tiddler.getFieldString("due");

            var Y = lastdue.slice(0, 4);
            var M = lastdue.slice(4, 6);
            var D = lastdue.slice(6, 8);
            var dateDue = Y + "-" + M + "-" + D;
            var dateNow = new Date().toISOString().split("T")[0];
            var diffTime = new Date(dateNow) - new Date(dateDue);

            var delay = Math.abs(diffTime / 86400000);

        } else {
            var delay = 0;
        }
        return delay;
    };
})();
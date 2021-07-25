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
            var h = due.slice(8, 10);
            var m = due.slice(10, 12);
            var s = due.slice(12, 14);
            var x = due.slice(14, 17);

            var dateDue = Y + "-" + M + "-" + D + "T" + h + ":" + m + ":" + s + "." + x + "Z";
            var diffTime = Math.abs(new Date() - new Date(dateDue));

            var result = diffTime / (1000 * 60 * 60 * 24);

        } else {
            var result = "0";
        }
        return result;
    };
})();
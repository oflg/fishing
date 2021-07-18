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
            var modified = tiddler.getFieldString("due");

            var year = modified.slice(0, 4);
            var month = modified.slice(4, 6);
            var day = modified.slice(6, 8);
            var arr = new Array(3);
            arr[0] = year;
            arr[1] = month;
            arr[2] = day;
            var dateDue = arr.join("-");

            var dateNow = (new Date()).toISOString().split('T')[0];
            var diffTime = Math.abs(new Date(dateNow) - new Date(dateDue));

            var result = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        } else {
            var result = "0";
        }
        return result;
    };
})();
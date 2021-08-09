/*\
title: $:/plugins/oflg/fishing/newdue.js
type: application/javascript
module-type: macro

returns newdue as tiddlywiki's date

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    exports.name = "newdue";

    exports.params = [];

    /*
    Run the macro
    */
    exports.run = function () {
        var title = this.getVariable("currentTiddler");
        var tiddler = this.wiki.getTiddler(title);

        if (tiddler && tiddler.hasField("interval")) {
            var interval = tiddler.getFieldString("interval");
        } else {
            var interval = 0;
        }

        var intervalTime = Number(interval) * (1000 * 60 * 60 * 24);
        var dateTime = new Date().getTime() + intervalTime;
        var result = new Date(dateTime).toISOString().split("T")[0].replace(/-/g, "") + "000000000";

        return result;
    };

})();
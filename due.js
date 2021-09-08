/*\
title: $:/plugins/oflg/fishing/due.js
type: application/javascript
module-type: macro

returns newdue as tiddlywiki's date

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    exports.name = "duejs";

    exports.params = [];

    /*
    Run the macro
    */
    exports.run = function () {
        var title = this.getVariable("currentTiddler");
        var tiddler = this.wiki.getTiddler(title);

        if (tiddler && tiddler.hasField("interval")) {
            var lastinterval = tiddler.getFieldString("interval");
        } else {
            var lastinterval = 0;
        }

        var lastintervalTime = Number(lastinterval) * 86400000;
        var dateTime = new Date().getTime() + lastintervalTime;
        var due = new Date(dateTime).toISOString().replace(/-|T|:|\.|Z/g, "");

        return due;
    };

})();
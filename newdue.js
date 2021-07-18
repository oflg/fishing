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

        var dateTime = new Date();
        dateTime = dateTime.setDate(dateTime.getDate() + parseInt(interval));
        dateTime = new Date(dateTime);
        var result = dateTime.toISOString().split('T')[0].replace(/-/g, "") + "000000000";

        return result;
    };

})();

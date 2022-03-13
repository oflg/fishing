/*\
title: $:/plugins/oflg/fishing/macros/lan.js
type: application/javascript
module-type: macro

Automatically switch multiple languages
\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    exports.name = "lan";

    exports.params = [
        { name: "lanfold" },
        { name: "index" }
    ];

    /*
    Run the macro
    */
    exports.run = function (lanfold, index) {

        var lan = $tw.wiki.filterTiddlers("[{$:/language}removeprefix[$:/languages]addprefix[" + lanfold + "]getindex[" + index + "]]~[[" + lanfold + "/en-GB]getindex[" + index + "]]")[0];

        return lan;// Action was invoked
    };

})();
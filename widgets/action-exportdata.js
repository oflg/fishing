/*\
Action widget to export fsrs data.
\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    var Widget = require("$:/core/modules/widgets/widget.js").widget;

    var ExportdataWidget = function (parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };

    /*
    Inherit from the base widget class
    */
    ExportdataWidget.prototype = new Widget();

    /*
    Render this widget into the DOM
    */
    ExportdataWidget.prototype.render = function (parent, nextSibling) {
        this.computeAttributes();
        this.execute();
    };

    /*
    Compute the internal state of the widget
    */
    ExportdataWidget.prototype.execute = function () {
        this.actionTiddler = this.getAttribute("$tiddler", "$:/temp/fishing/fsrsdata");
        this.actionTimestamp = this.getAttribute("$timestamp", "yes") === "yes";
    };

    /*
    Refresh the widget by ensuring our attributes are up to date
    */
    ExportdataWidget.prototype.refresh = function (changedTiddlers) {
        var changedAttributes = this.computeAttributes();
        if (changedAttributes["$tiddler"] || changedAttributes["$timestamp"]) {
            this.refreshSelf();
            return true;
        }
        return this.refreshChildren(changedTiddlers);
    };

    /*
    Invoke the action associated with this widget
    */
    ExportdataWidget.prototype.invokeAction = function (triggeringWidget, event) {
        var title = this.actionTiddler;

        var tiddlerArry = $tw.wiki.filterTiddlers("[has[history]]");

        var data = {};

        var globalData = $tw.wiki.getTiddlerData('$:/plugins/oflg/fishing/data');

        data.globalData = globalData;

        data.cardsData = [];

        function getJson(jsonString) {
            jsonString = jsonString || "[]";
            var result = [];
            try {
                result = JSON.parse(jsonString);
            } catch (error) {
                console.log("JSON error : " + error);
                console.log(jsonString);
            }
            return result;
        }

        for (var f = 0; f < tiddlerArry.length; f++) {

            var tiddlerData = $tw.wiki.getTiddler(tiddlerArry[f]).fields;

            var tiddlerDue = String(tiddlerData.due),
                tiddlerInterval = Number(tiddlerData.interval),
                tiddlerDifficulty = Number(tiddlerData.difficulty),
                tiddlerStability = Number(tiddlerData.stability),
                tiddlerRetrievability = Number(tiddlerData.retrievability),
                tiddlerGrade = Number(tiddlerData.grade),
                tiddlerLapses = Number(tiddlerData.lapses),
                tiddlerReps = Number(tiddlerData.reps),
                tiddlerReview = String(tiddlerData.review),
                tiddlerHistory = String(tiddlerData.history);

            var tiddlerHistoryArry = getJson(tiddlerHistory);

            if (typeof tiddlerGrade === 'number' && !isNaN(tiddlerGrade)) {

                tiddlerHistoryArry.push({
                    due: tiddlerDue,
                    interval: tiddlerInterval,
                    difficulty: tiddlerDifficulty,
                    stability: tiddlerStability,
                    retrievability: tiddlerRetrievability,
                    grade: tiddlerGrade,
                    lapses: tiddlerLapses,
                    reps: tiddlerReps,
                    review: tiddlerReview
                });
            }

            if (tiddlerHistoryArry.length > 0) {

                data.cardsData.push(tiddlerHistoryArry);
            }
        }

        var creationFields = this.actionTimestamp ? $tw.wiki.getCreationFields() : undefined,
            modificationFields = this.actionTimestamp ? $tw.wiki.getModificationFields() : undefined;

        $tw.wiki.addTiddler(
            new $tw.Tiddler($tw.wiki.getCreationFields(), { title, text: JSON.stringify(data) }, modificationFields)
        );

        return true;// Action was invoked
    };

    exports["action-exportdata"] = ExportdataWidget;
})();
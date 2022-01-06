/*\
title: $:/plugins/oflg/fishing/action-fishing.js
type: application/javascript
module-type: widget
Run Free Spaced Repetition Algorithm created by 叶峻峣（https://github.com/L-M-Sherlock， https://www.zhihu.com/people/L.M.Sherlock）and ported to TiddlyWiki by oflg.
\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    var Widget = require("$:/core/modules/widgets/widget.js").widget;

    var FishingWidget = function (parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };

    /*
    Inherit from the base widget class
    */
    FishingWidget.prototype = new Widget();

    /*
    Render this widget into the DOM
    */
    FishingWidget.prototype.render = function (parent, nextSibling) {
        this.computeAttributes();
        this.execute();
    };

    /*
    Compute the internal state of the widget
    */
    FishingWidget.prototype.execute = function () {
        this.actionTiddler = this.getAttribute("$tiddler", this.getVariable("currentTiddler"));
        this.actionGrade = String(this.getAttribute("$grade"));
        this.actionTimestamp = this.getAttribute("$timestamp", "yes") === "yes";
    };

    /*
    Refresh the widget by ensuring our attributes are up to date
    */
    FishingWidget.prototype.refresh = function (changedTiddlers) {
        var changedAttributes = this.computeAttributes();
        if (changedAttributes["$tiddler"] || changedAttributes["$grade"] || changedAttributes["$timestamp"]) {
            this.refreshSelf();
            return true;
        }
        return this.refreshChildren(changedTiddlers);
    };

    /*
    Invoke the action associated with this widget
    */
    FishingWidget.prototype.invokeAction = function (triggeringWidget, event) {
        var title = this.actionTiddler,//The title of the tiddler is the id of the card.
            grade = (this.actionGrade === "0" || this.actionGrade === "1" || this.actionGrade === "2") ? this.actionGrade : undefined;//Ratings for review have 0, 1, 2. Other ratings mean add new cards.


        var difficultyDecay = -0.7,
            stabilityDecay = -0.2,
            increaseFactor = 60;

        var requestRecall = Number($tw.wiki.filterTiddlers("[{$:/plugins/oflg/fishing/data!!requestRecall}]")[0]),
            data = JSON.parse($tw.wiki.filterTiddlers("[{$:/plugins/oflg/fishing/data}]")[0]);

        var totalCase = data.totalCase,
            totalDiff = data.totalDiff,
            totalReview = data.totalReview,
            defaultDifficulty = data.defaultDifficulty,
            defaultStability = data.defaultStability,
            stabilityDataArry = data.stabilityDataArry;

        var due, interval, difficulty, stability, recall, lapses, reps, review, history;

        review = new Date().toISOString().replace(/-|T|:|\.|Z/g, "");

        if (grade === undefined) {// new card
            var addDay = Math.max(Math.round(defaultStability * Math.log(requestRecall) / Math.log(0.9)), 1);

            due = new Date(addDay * (1000 * 60 * 60 * 24) + new Date().getTime()).toISOString().replace(/-|T|:|\.|Z/g, "");
            interval = 0;
            difficulty = defaultDifficulty;
            stability = defaultStability;
            recall = 1;
            reps = 1;
            lapses = 0;
            history = "[]";
        } else {// review card
            var lastFieldsData = $tw.wiki.getTiddler(title).fields;

            var lastDifficulty = Number(lastFieldsData["difficulty"]),
                lastStability = Number(lastFieldsData["stability"]),
                lastLapses = Number(lastFieldsData["lapses"]),
                lastReps = Number(lastFieldsData["reps"]),
                lastReview = String(lastFieldsData["review"]),
                lastHistory = JSON.parse(lastFieldsData["history"]);

            var lastReviewDay = lastReview.slice(0, 4) + "-" + lastReview.slice(4, 6) + "-" + lastReview.slice(6, 8);

            interval = (new Date(new Date().toISOString().split("T")[0]) - new Date(lastReviewDay)) / (1000 * 60 * 60 * 24);
            difficulty = Math.min(Math.max(lastDifficulty + recall - grade + 0.2, 1), 10);
            recall = Math.exp(Math.log(0.9) * interval / lastStability);

            if (grade === "0") {
                stability = defaultStability * Math.exp(-0.3 * (lastLapses + 1));

                if (lastReps > 1) {
                    totalDiff = totalDiff - recall;
                }
                lapses = lastLapses + 1;
                reps = 1;
            } else {//grade === "1" || grade === "2"
                stability = lastStability * (1 + increaseFactor * Math.pow(difficulty, difficultyDecay) * Math.pow(lastStability, stabilityDecay) * (Math.exp(1 - recall) - 1));

                if (lastReps > 1) {
                    totalDiff = totalDiff + 1 - recall;
                }
                reps = lastReps + 1;
            }

            totalCase = totalCase + 1;
            totalReview = totalReview + 1;

            var addDay = Math.max(Math.round(stability * Math.log(requestRecall) / Math.log(0.9)), 1);

            due = new Date(addDay * (1000 * 60 * 60 * 24) + new Date().getTime()).toISOString().replace(/-|T|:|\.|Z/g, "");

            lastHistory.push({
                due,
                interval,
                difficulty,
                stability,
                recall,
                lapses,
                reps,
                review
            });

            history = JSON.stringify(lastHistory);

            // Adaptive defaultDifficulty
            if (totalCase > 100) {
                defaultDifficulty = 1 / Math.pow(totalReview, 0.3) * Math.pow(Math.log(requestRecall) / Math.log(requestRecall + totalDiff / totalCase), 1 / difficultyDecay) * 5 + (1 - 1 / Math.pow(totalReview, 0.3)) * defaultDifficulty;

                totalDiff = 0
                totalCase = 0
            }

            // Adaptive defaultStability
            if (lastReps === 1 && lastLapses === 0) {
                stabilityDataArry.push({
                    interval: interval,
                    recall: grade === "0" ? 0 : 1
                });

                if (stabilityDataArry.length > 0 && stabilityDataArry.length % 50 === 0) {
                    var intervalSetArry = [];
                    var sumRecallIntervalToStability = 0;
                    var sumIntervalToStability = 0;
                    for (var s = 0; s < stabilityDataArry.length; s++) {
                        var ivl = stabilityDataArry[s].interval;

                        if (intervalSetArry.indexOf(ivl) === -1) {

                            intervalSetArry.push(ivl);

                            var filterArry = stabilityDataArry.filter(function (fi) {
                                return fi.interval === ivl;
                            });

                            var recallSum = filterArry.reduce((sum, e) => sum + e.recall, 0);

                            if (recallSum > 0) {
                                sumRecallIntervalToStability = sumRecallIntervalToStability + ivl * Math.log(recallSum / filterArry.length) * filterArry.length;
                                sumIntervalToStability = sumIntervalToStability + ivl * ivl * filterArry.length;
                            }
                        }
                    }
                    defaultStability = (Math.max(Math.log(0.9) / (sumRecallIntervalToStability / sumIntervalToStability), 0.1) + defaultStability) / 2;
                }
            }
        }

        var creationFields = this.actionTimestamp ? this.wiki.getCreationFields() : undefined,
            modificationFields = this.actionTimestamp ? this.wiki.getModificationFields() : undefined;

        this.wiki.addTiddler(
            new $tw.Tiddler(creationFields, this.wiki.getTiddler(title), modificationFields, {
                due,
                interval,
                difficulty,
                stability,
                recall,
                lapses,
                reps,
                review,
                history
            })
        );

        this.wiki.addTiddler(
            new $tw.Tiddler(creationFields, this.wiki.getTiddler("$:/plugins/oflg/fishing/data"), modificationFields, {
                text: JSON.stringify({
                    totalCase,
                    totalDiff,
                    totalReview,
                    defaultDifficulty,
                    defaultStability,
                    stabilityDataArry
                })
            })
        );

        return true;// Action was invoked
    };

    exports["action-fishing"] = FishingWidget;
})();
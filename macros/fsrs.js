/*\
Use Free Spaced Repetition Scheduler: https://github.com/open-spaced-repetition/free-spaced-repetition-scheduler
\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    exports.name = "fsrs";

    exports.params = [
        { name: "title" },
        { name: "grade" }
    ];

    /*
    Run the macro
    */
    exports.run = function (title, grade) {
        grade = (grade == "0" || grade == "1" || grade == "2") ? Number(grade) : -1;//Ratings for review have 0, 1, 2. Other ratings mean learn new tiddler.

        var globalData = $tw.wiki.getTiddlerData('$:/plugins/oflg/fishing/data');

        function faultToleranceValue(value, defaultValue) {
            return (typeof value === 'number' && !isNaN(value)) ? value : defaultValue;
        }

        var increaseFactor = 60,
            difficultyDecay = -0.7,
            stabilityDecay = -0.2,
            requestRetention = faultToleranceValue(globalData.requestRetention, 0.9),
            totalCase = faultToleranceValue(globalData.totalCase, 0),
            totalDiff = faultToleranceValue(globalData.totalDiff, 0),
            totalReview = faultToleranceValue(globalData.totalReview, 0),
            defaultDifficulty = faultToleranceValue(globalData.defaultDifficulty, 5),
            defaultStability = faultToleranceValue(globalData.defaultStability, 2),
            stabilityDataArry = globalData.stabilityDataArry || [];

        requestRetention = requestRetention >= 0.75 && requestRetention <= 0.95 ? requestRetention : 0.9;

        var due, interval, difficulty, stability, retrievability, lapses, reps, review, history;

        review = new Date().toISOString().replace(/\-|T|:|\.|Z/g, "");

        if (grade == -1) {// learn new tiddler
            var addDay = Math.round(defaultStability * Math.log(requestRetention) / Math.log(0.9));

            due = $tw.wiki.filterTiddlers("[[" + addDay + "]due[]]")[0];
            interval = 0;
            difficulty = defaultDifficulty;
            stability = defaultStability;
            retrievability = 1;
            grade = -1;
            reps = 1;
            lapses = 0;
            history = "[]";
        } else {// review tiddler after learn
            var lastFieldsData = $tw.wiki.getTiddler(title).fields;

            var lastDue = String(lastFieldsData.due),
                lastInterval = Number(lastFieldsData.interval),
                lastDifficulty = Number(lastFieldsData.difficulty),
                lastStability = Number(lastFieldsData.stability),
                lastRetrievability = Number(lastFieldsData.retrievability),
                lastGrade = Number(lastFieldsData.grade),
                lastLapses = Number(lastFieldsData.lapses),
                lastReps = Number(lastFieldsData.reps),
                lastReview = String(lastFieldsData.review),
                lastHistory = JSON.parse(lastFieldsData.history);

            interval = Number($tw.wiki.filterTiddlers("[[" + lastReview + "]interval[]]")[0]);
            retrievability = Math.exp(Math.log(0.9) * interval / lastStability);
            difficulty = Math.min(Math.max(lastDifficulty + retrievability - grade + 0.2, 1), 10);

            if (grade == 0) {
                stability = defaultStability * Math.exp(-0.3 * (lastLapses + 1));

                if (lastReps > 1) {
                    totalDiff = totalDiff - retrievability;
                }
                lapses = lastLapses + 1;
                reps = 1;
            } else {//grade == 1 || grade == 2
                stability = lastStability * (1 + increaseFactor * Math.pow(difficulty, difficultyDecay) * Math.pow(lastStability, stabilityDecay) * (Math.exp(1 - retrievability) - 1));

                if (lastReps > 1) {
                    totalDiff = totalDiff + 1 - retrievability;
                }
                lapses = lastLapses;
                reps = lastReps + 1;
            }

            totalCase = totalCase + 1;
            totalReview = totalReview + 1;

            var addDay = Math.round(stability * Math.log(requestRetention) / Math.log(0.9));

            due = $tw.wiki.filterTiddlers("[[" + addDay + "]due[]]")[0];

            lastHistory.push({
                due: lastDue,
                interval: lastInterval,
                difficulty: lastDifficulty,
                stability: lastStability,
                retrievability: lastRetrievability,
                grade: lastGrade,
                lapses: lastLapses,
                reps: lastReps,
                review: lastReview
            });

            history = JSON.stringify(lastHistory);

            // Adaptive defaultDifficulty
            if (totalCase > 100) {
                defaultDifficulty = 1 / Math.pow(totalReview, 0.3) * Math.pow(Math.log(requestRetention) / Math.max(Math.log(requestRetention + totalDiff / totalCase), 0), 1 / difficultyDecay) * 5 + (1 - 1 / Math.pow(totalReview, 0.3)) * defaultDifficulty;

                totalDiff = 0;
                totalCase = 0;
            }

            // Adaptive defaultStability
            if (lastReps === 1 && lastLapses === 0) {
                stabilityDataArry.push({
                    interval: interval,
                    retrievability: grade === "0" ? 0 : 1
                });

                if (stabilityDataArry.length > 0 && stabilityDataArry.length % 50 === 0) {
                    var intervalSetArry = [];

                    var sumRI2S = 0,
                        sumI2S = 0;
                    for (var s = 0; s < stabilityDataArry.length; s++) {
                        var ivl = stabilityDataArry[s].interval;

                        if (intervalSetArry.indexOf(ivl) === -1) {

                            intervalSetArry.push(ivl);

                            var filterArry = stabilityDataArry.filter(function (fi) {
                                return fi.interval === ivl;
                            });

                            var retrievabilitySum = filterArry.reduce(function (sum, e) {
                                return sum + e.retrievability;
                            }, 0);

                            if (retrievabilitySum > 0) {
                                sumRI2S = sumRI2S + ivl * Math.log(retrievabilitySum / filterArry.length) * filterArry.length;
                                sumI2S = sumI2S + ivl * ivl * filterArry.length;
                            }
                        }
                    }
                    defaultStability = (Math.max(Math.log(0.9) / (sumRI2S / sumI2S), 0.1) + defaultStability) / 2;
                }
            }
        }

        var tiddlerData = {
            due: due,
            interval: interval,
            difficulty: difficulty,
            stability: stability,
            retrievability: retrievability,
            lapses: lapses,
            reps: reps,
            grade: grade,
            review: review,
            history: history
        };

        globalData = {
            requestRetention: requestRetention,
            increaseFactor: increaseFactor,
            difficultyDecay: difficultyDecay,
            stabilityDecay: stabilityDecay,
            totalCase: totalCase,
            totalDiff: totalDiff,
            totalReview: totalReview,
            defaultDifficulty: defaultDifficulty,
            defaultStability: defaultStability,
            stabilityDataArry: stabilityDataArry
        };

        return { tiddlerData: tiddlerData, globalData: globalData };// Action was invoked
    };

})();
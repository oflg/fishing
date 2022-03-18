/*\
title: $:/plugins/oflg/fishing/widgets/action-learn.js
type: application/javascript
module-type: widget

Action widget to set fishing fields on tiddlers.
\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";

    var Widget = require("$:/core/modules/widgets/widget.js").widget;

    var LearnWidget = function (parseTreeNode, options) {
        this.initialise(parseTreeNode, options);
    };

    /*
    Inherit from the base widget class
    */
    LearnWidget.prototype = new Widget();

    /*
    Render this widget into the DOM
    */
    LearnWidget.prototype.render = function (parent, nextSibling) {
        this.computeAttributes();
        this.execute();
    };

    /*
    Compute the internal state of the widget
    */
    LearnWidget.prototype.execute = function () {
        this.actionTiddler = this.getAttribute("$tiddler", this.getVariable("currentTiddler"));
        this.actionGrade = this.getAttribute("$grade");
        this.actionTimestamp = this.getAttribute("$timestamp", "yes") === "yes";
    };

    /*
    Refresh the widget by ensuring our attributes are up to date
    */
    LearnWidget.prototype.refresh = function (changedTiddlers) {
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
    LearnWidget.prototype.invokeAction = function (triggeringWidget, event) {
        var title = this.actionTiddler,
            grade = this.actionGrade;

        var data = $tw.macros.fsrs.run(title, grade);//Use Free Spaced Repetition Scheduler in $:/plugins/oflg/fishing/macros/fsrs.js

        var creationFields = this.actionTimestamp ? $tw.wiki.getCreationFields() : undefined,
            modificationFields = this.actionTimestamp ? $tw.wiki.getModificationFields() : undefined;

        $tw.wiki.addTiddler(
            new $tw.Tiddler(creationFields, $tw.wiki.getTiddler(title), modificationFields, data.tiddlerData)
        );

        $tw.wiki.addTiddler(
            new $tw.Tiddler(creationFields, $tw.wiki.getTiddler("$:/plugins/oflg/fishing/data"), modificationFields, {
                text: JSON.stringify(data.globalData)
            })
        );

        return true;// Action was invoked
    };

    exports["action-learn"] = LearnWidget;
})();
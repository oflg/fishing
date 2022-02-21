/*\
title: $:/plugins/oflg/fishing/action-fishing.js
type: application/javascript
module-type: widget

Action widget to set fishing fields on tiddlers.
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
        this.actionGrade = this.getAttribute("$grade");
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
        var title = this.actionTiddler,
            grade = this.actionGrade;

        var data = $tw.macros.fsrs.run(title, grade);//Use Free Spaced Repetition Scheduler in fsrs.js

        var creationFields = this.actionTimestamp ? $tw.wiki.getCreationFields() : undefined,
            modificationFields = this.actionTimestamp ? $tw.wiki.getModificationFields() : undefined;

        $tw.wiki.addTiddler(
            new $tw.Tiddler(creationFields, $tw.wiki.getTiddler(title), modificationFields, data.itemData)
        );

        $tw.wiki.addTiddler(
            new $tw.Tiddler(creationFields, $tw.wiki.getTiddler("$:/plugins/oflg/fishing/data"), modificationFields, {
                text: JSON.stringify(data.fsrsData)
            })
        );

        return true;// Action was invoked
    };

    exports["action-fishing"] = FishingWidget;
})();
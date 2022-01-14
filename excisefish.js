/*\
title: $:/plugins/oflg/fishing/excisefish.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to excise the selection to a new fishing qa tiddler.
Based on TW's core/modules/editor/operations/text/excise.js

\*/
(function () {

    /*jslint node: true, browser: true */
    /*global $tw: false */
    "use strict";
    exports["excisefish"] = function (event, operation) {
        var selectionText = operation.selection,
            exciseForm = event.paramObject.exciseForm,
            exciseCaption = event.paramObject.exciseCaption,
            exciseTo = event.paramObject.exciseTo;

        var editTiddlerTitle = this.editTitle;

        var editTiddler = $tw.wiki.getTiddler(editTiddlerTitle);

        if (editTiddler && editTiddler.fields["draft.title"]) {//is draft tiddler

            editTiddlerTitle = editTiddler.fields["draft.title"];

        }

        var currenttime = new Date(new Date().getTime()).toISOString().replace(/-|T|:|\.|Z/g, "");

        //excise form
        if (exciseForm === "title<br>text") {

            var fishTitle = selectionText.split("\n")[0],
                fishText = selectionText.replace(fishTitle, "");

        } else if (exciseForm === "title<br>") {

            var fishTitle = selectionText.split("\n")[0],
                fishText = "";

        } else {
            // default to __''title''__text
            var fishTitle = selectionText.indexOf("''__") !== -1 ? selectionText.split("''__")[0].replace("__''", "") : editTiddlerTitle + "/" + currenttime,
                fishText = selectionText.indexOf("''__") !== -1 ? selectionText.replace("__''" + fishTitle + "''__", "") : operation.selection;

        }

        var title = $tw.wiki.generateNewTitle(fishTitle.replace(/\||\{|\}|\[|\]/g, "")),
            caption = exciseCaption ? exciseCaption : "{{||Excerpt}}";

        //excise to
        if (exciseTo === "newtiddler") {
            var text = fishText,
                tags = [editTiddlerTitle, "?"],
                priority = editTiddler.fields["priority"] || 0;

            if (caption === "{{||Excerpt}}") {

                var interval = Number($tw.wiki.filterTiddlers("[{$:/plugins/oflg/fishing/data!!requestInterval}]")[0]),
                    due = $tw.wiki.filterTiddlers("[[" + interval + "]due[]]")[0];

                $tw.wiki.addTiddler(
                    new $tw.Tiddler($tw.wiki.getCreationFields(), $tw.wiki.getModificationFields(), {
                        title,
                        text,
                        caption,
                        tags,
                        priority,
                        due,
                        interval
                    })
                );

            } else {//learn tiddler
                $tw.rootWidget.invokeActionString("<$action-fishing $tiddler=" + title + " $grade='learn'/>");
            }

            if (editTiddler.type === "text/x-markdown") {

                operation.replacement = "[[" + title + "]]{{" + title + "}}";

            } else {

                operation.replacement = "\n[[" + title + "]]\n\n<<<.tc-fish-quote\n{{" + title + "}}\n<<<\n\n";

            }

            operation.cutStart = operation.selStart;
            operation.cutEnd = operation.selEnd;
            operation.newSelStart = operation.selStart;
            operation.newSelEnd = operation.selStart + operation.replacement.length;

        } else {
            // default to current tiddler
            var draftTitle = title || editTiddler.fields["draft.title"];

            $tw.wiki.addTiddler(
                new $tw.Tiddler($tw.wiki.getCreationFields(), editTiddler, $tw.wiki.getModificationFields(), {
                    "draft.title": draftTitle,
                    tags: editTiddler.getFieldString("tags") + " ?",
                    caption
                })
            );
        }

    };
})();
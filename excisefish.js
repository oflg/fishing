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
        var editTiddlerTitle = this.editTitle;
        var editTiddler = this.wiki.getTiddler(editTiddlerTitle);

        if (editTiddler && editTiddler.fields["draft.title"]) {

            editTiddlerTitle = editTiddler.fields["draft.title"];

        }

        var currenttime = new Date(new Date().getTime()).toISOString().replace(/-|T|:|\.|Z/g, "");

        if (event.paramObject.exciseform === "title<br>text") {

            var fishtitle = operation.selection.split("\n")[0],
                fishtext = operation.selection.replace(fishtitle, "");

        } else if (event.paramObject.exciseform === "title<br>") {

            var fishtitle = operation.selection.split("\n")[0],
                fishtext = "";

        } else {
            // default to __''title''__text
            var fishtitle = operation.selection.indexOf("''__") !== -1 ? operation.selection.split("''__")[0].replace("__''", "") : editTiddlerTitle + "/" + currenttime,
                fishtext = operation.selection.indexOf("''__") !== -1 ? operation.selection.replace("__''" + fishtitle + "''__", "") : operation.selection;

        }

        var title = this.wiki.generateNewTitle(fishtitle.replace(/\||\{|\}|\[|\]/g, "")),
            caption = event.paramObject.caption ? event.paramObject.caption : "{{||Excerpt}}";

        if (event.paramObject.exciseto === "newtiddler") {
            var interval = Number($tw.wiki.filterTiddlers("[{$:/plugins/oflg/fishing/data!!requestInterval}]")[0]);

            var text = fishtext,
                tags = [editTiddlerTitle, "?"],
                priority = editTiddler.fields["priority"] || 0,
                due = $tw.wiki.filterTiddlers("[[" + interval + "]due[]]")[0];

            this.wiki.addTiddler(
                new $tw.Tiddler(this.wiki.getCreationFields(), this.wiki.getModificationFields(), {
                    title,
                    text,
                    tags,
                    due,
                    interval,
                    caption,
                    priority
                })
            );


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
            this.wiki.addTiddler(
                new $tw.Tiddler(this.wiki.getCreationFields(), editTiddler, this.wiki.getModificationFields(), {
                    "draft.title": title || editTiddler.fields["draft.title"],
                    tags: editTiddler.getFieldString("tags") + " ?",
                    caption
                })
            );
        }

    };
})();
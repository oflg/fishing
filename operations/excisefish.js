/*\
title: $:/plugins/oflg/fishing/operations/excisefish.js
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
        if (operation.selection) {

            var selectionText = operation.selection,
                exciseCaption = event.paramObject.exciseCaption;

            var editTiddlerTitle = this.editTitle;

            var editTiddler = $tw.wiki.getTiddler(editTiddlerTitle);

            if (editTiddler && editTiddler.fields["draft.title"]) {//is draft tiddler
                editTiddlerTitle = editTiddler.fields["draft.title"];
            }

            var tags = [editTiddlerTitle, "?"],
                priority = editTiddler.fields["priority"] || 0;

            var rTitle = editTiddlerTitle + "/" + new Date(new Date().getTime()).toISOString().replace(/-|T|:|\.|Z/g, "");

            if (exciseCaption === "{{||Excerpt}}") { //to excerpt tiddler

                var title = selectionText.indexOf("''__") !== -1 ? selectionText.split("''__")[0].split("__''").slice(-1)[0] : rTitle,
                    text = selectionText.indexOf("''__") !== -1 ? selectionText.replace(title + "''__", "").replace("__''", "") : operation.selection,
                    caption = "{{||Excerpt}}",
                    interval = Number($tw.wiki.getTiddler("$:/plugins/oflg/fishing/data").fields.requestInterval),
                    due = $tw.wiki.filterTiddlers("[[" + interval + "]due[]]")[0];

                title = $tw.wiki.generateNewTitle(title.replace(/\||\{|\}|\[|\]|\'/g, ""));

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

            } else {// default to question tiddler
                var nTitle = selectionText.split("\n")[0];

                if (nTitle.indexOf("''__") == -1 && nTitle.indexOf("__") !== -1) { //Select or Cloze question tiddler

                    var title = nTitle,
                        text = selectionText.replace(nTitle, "");

                    if (/^[0-9A-I]+$/.test(nTitle.split("__").slice(-1)[0])) {

                        var caption = "{{||Select}}";

                    } else {

                        var caption = "{{||Cloze}}";

                    }

                } else { //Q&A question tiddler

                    var title = selectionText.indexOf("''__") !== -1 ? selectionText.split("''__")[0].split("__''").slice(-1)[0] : rTitle,
                        text = selectionText.indexOf("''__") !== -1 ? selectionText.replace(title + "''__", "").replace("__''", "") : operation.selection,
                        caption = "{{||Question}}";
                }

                title = $tw.wiki.generateNewTitle(title.replace(/\||\{|\}|\[|\]|\'/g, ""));

                $tw.wiki.addTiddler(
                    new $tw.Tiddler($tw.wiki.getCreationFields(), $tw.wiki.getModificationFields(), {
                        title,
                        text,
                        caption,
                        tags,
                        priority
                    })
                );

                $tw.rootWidget.invokeActionString('<$action-fishing $tiddler="""' + title + '""" $grade="learn"/>');
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
        }
    };
})();
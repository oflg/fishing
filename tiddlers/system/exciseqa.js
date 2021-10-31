/*\
title: $:/core/modules/editor/operations/text/exciseqa.js
type: application/javascript
module-type: texteditoroperation

Text editor operation to excise the selection to a new fishing qa tiddler.
Based on TW's core/modules/editor/operations/text/excise.js

\*/
exports['exciseqa'] = function (event, operation) {
  const editTiddler = this.wiki.getTiddler(this.editTitle);
  let editTiddlerTitle = this.editTitle;
  if (editTiddler && editTiddler.fields['draft.of']) {
    editTiddlerTitle = editTiddler.fields['draft.of'];
  }
  // modified here, we use selection as template title, waiting for user to change it to a question
  // and we don't need title param now
  const excisionTitle = this.wiki.generateNewTitle(operation.selection);
  this.wiki.addTiddler(
    new $tw.Tiddler(this.wiki.getCreationFields(), this.wiki.getModificationFields(), {
      title: excisionTitle,
      text: operation.selection,
      tags: event.paramObject.tagnew === 'yes' ? [editTiddlerTitle] : [],
    })
  );
  // "?" is the default fishing macro
  operation.replacement = `<<${event.paramObject.macro || '?'} """${excisionTitle}""">>`;
	// delete original texts
  operation.cutStart = operation.selStart;
  operation.cutEnd = operation.selEnd;
  operation.newSelStart = operation.selStart;
  operation.newSelEnd = operation.selStart + operation.replacement.length;
};

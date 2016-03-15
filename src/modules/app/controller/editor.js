import prosemirrorFct from "src/modules/prosemirror/factory/prosemirror";

function appControllerEditor(prosemirrorFct) {

	this.currentComment = '';

	this.prosemirrorFct = prosemirrorFct;

	this.prosemirrorFct.autosave();

}

appControllerEditor.$inject = [prosemirrorFct.name];

export default appControllerEditor;
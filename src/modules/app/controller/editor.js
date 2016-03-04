import prosemirrorFct from "src/modules/prosemirror/factory/prosemirror";

function appControllerEditor(prosemirrorFct) {

	this.currentComment = '';

	// Prose Mirror instance
	this.pm = {
		editor: null,
		onResolveAnnotation: null
	};

	this.prosemirrorFct = prosemirrorFct;

	this.prosemirrorFct.autosave();

	this.submit = function () {
		prosemirrorFct.addAnnotation(this.currentComment);
	};

}

appControllerEditor.$inject = [prosemirrorFct.name];

export default appControllerEditor;
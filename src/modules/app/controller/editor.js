import prosemirrorFct from "src/modules/prosemirror/factory/prosemirror";
import accountFct from "src/modules/account/factory/account";

function appControllerEditor(prosemirrorFct, accountFct) {

	this.prosemirrorFct = prosemirrorFct;
	this.accountFct = accountFct;

	this.prosemirrorFct.autosave();

}

appControllerEditor.$inject = [prosemirrorFct.name];

export default appControllerEditor;
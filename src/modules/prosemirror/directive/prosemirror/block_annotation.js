import {BlockQuote, Attribute, NodeKind} from 'prosemirror/dist/model';
import {elt} from 'prosemirror/dist/dom';
import {InputRule, addInputRule, removeInputRule} from "prosemirror/dist/inputrules";


class Annotation extends BlockQuote {

	get attrs() {
		return {
			// Inspired from Uuid generation
			hash: new Attribute({compute: () => {
				let d = new Date().getTime();
				return 'xxxxxxxxxx'.replace(/[x]/g, (c) => {
					d = Math.floor(d / 16);
					return (d + Math.random() * 16) % 16 | 0;
				});
			}}),
			isResolved: new Attribute({default: false})
		}
	}
}


Annotation.register("parseDOM", "blockquote", {parse: "block"})
Annotation.prototype.serializeDOM = (node, s) => {
	console.log(node);
	s.renderAs(node, "blockquote");//, {hash: node.attrs.hash, isResolved: node.attrs.isResolved});
};

Annotation.register("autoInput", "startBlockQuote", new InputRule(
	/^\s*> $/, " ",
	function(pm, _, pos) { wrapAndJoin(pm, pos, this) }
));

Annotation.register("command", "wrap", {
	derive: true,
	label: "Wrap the selection in a block quote",
	menu: {
		group: "block", rank: 45,
		display: {
			type: "label",
			label: "Ann"
		}
	},
	keys: ["Alt-Right '>'", "Alt-Right '\"'"]
})

Annotation.register("command", "make", {
	derive: true,
	label: "Change to annotation",
	menu: {
		group: "textblock", rank: 2,
		display: {type: "label", label: "Ann"}
	}
});

/*
Annotation.register("parseDOM", "annotation", {
	parse(dom, state) {
		state.wrapMark(dom, this.create({hash: dom.getAttribute("hash"), isResolved: dom.getAttribute('isResolved')}))
	},
	selector: "[hash]"
})
*/

/*
Annotation.register("command", "set",
	{
		derive: true,
		label: "Annotate",
		menu: {
			group: "inline", rank: 1,
			display: {
				type: "label",
				label: "Ann"
			}
		}
	}
);
Annotation.register("command", "unset", {derive: true, label: "Remove annotation"})
Annotation.register("command", "toggle", {
	derive: true,
	label: "Toggle annotation"

});





Annotation.prototype.openMarkdown = "@";
Annotation.prototype.closeMarkdown = "@";
*/


export default Annotation;
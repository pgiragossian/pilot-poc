import {MarkType, Attribute} from 'prosemirror/dist/model';
import {elt} from 'prosemirror/dist/dom';

class Annotation extends MarkType {
	static get rank() {
		return 53
	}

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

Annotation.register("command", "set", {derive: true, label: "Annotate"})
Annotation.register("command", "unset", {derive: true, label: "Remove annotation"})
Annotation.register("command", "toggle", {
	derive: true,
	label: "Toggle annotation",
	menu: {
		group: "inline", rank: 1,
		display: {
			type: "label",
			label: "Ann"
		}
	}
});
Annotation.register("parseDOM", "annotation", {
	parse(dom, state) {
		state.wrapMark(dom, this.create({hash: dom.getAttribute("hash"), isResolved: dom.getAttribute('isResolved')}))
	},
	selector: "[hash]"
})

Annotation.prototype.serializeDOM = mark => elt("annotation", {hash: mark.attrs.hash, isResolved: mark.attrs.isResolved});

Annotation.prototype.openMarkdown = "@";
Annotation.prototype.closeMarkdown = "@";

export default Annotation;
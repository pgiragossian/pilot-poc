import {MarkType, Attribute} from 'prosemirror/dist/model';
import {openPrompt, ParamPrompt} from 'prosemirror/dist/ui/prompt';
import {elt} from 'prosemirror/dist/dom';

console.log(ParamPrompt);

ParamPrompt.prototype.prompt = function() {
	return openPrompt(this.pm, this.form, {pos:topOfNodeSelection(this.pm), onClose: () => this.close()})
};


function topOfNodeSelection(pm) {
	let selected = window.document.querySelector(".ProseMirror-tooltip")
	if (!selected) return {left: 0, top: 0}
	let box = selected.getBoundingClientRect();
	return {left: Math.min((box.left + box.right) / 2, box.left + 20), top: box.top}
}

export class LinkMarkPilot extends MarkType {
	static get rank() { return 25 }
	get attrs() {
		return {
			href: new Attribute,
		}
	}
}

LinkMarkPilot.register("parseDOM", "a", {
	parse(dom, state) {
		state.wrapMark(dom, this.create({href: dom.getAttribute("href")}))
	},
	selector: "[href]"
});

const linkIcon = {
	type: "icon",
	width: 951, height: 1024,
	path: "M832 694q0-22-16-38l-118-118q-16-16-38-16-24 0-41 18 1 1 10 10t12 12 8 10 7 14 2 15q0 22-16 38t-38 16q-8 0-15-2t-14-7-10-8-12-12-10-10q-18 17-18 41 0 22 16 38l117 118q15 15 38 15 22 0 38-14l84-83q16-16 16-38zM430 292q0-22-16-38l-117-118q-16-16-38-16-22 0-38 15l-84 83q-16 16-16 38 0 22 16 38l118 118q15 15 38 15 24 0 41-17-1-1-10-10t-12-12-8-10-7-14-2-15q0-22 16-38t38-16q8 0 15 2t14 7 10 8 12 12 10 10q18-17 18-41zM941 694q0 68-48 116l-84 83q-47 47-116 47-69 0-116-48l-117-118q-47-47-47-116 0-70 50-119l-50-50q-49 50-118 50-68 0-116-48l-118-118q-48-48-48-116t48-116l84-83q47-47 116-47 69 0 116 48l117 118q47 47 47 116 0 70-50 119l50 50q49-50 118-50 68 0 116 48l118 118q48 48 48 116z"
};

LinkMarkPilot.register("command", "unset", {
	derive: true,
	label: "Unlink",
	menu: {group: "inline", rank: 30, display: linkIcon},
	active() { return true }
});

LinkMarkPilot.register("command", "set", {
	derive: {
		inverseSelect: true,
		params: [
			{label: "Lien", attr: "href"}
		]
	},
	/*
	run(pm, target) {
		let form = elt('form', {id: 'LinkMarkPilotForm'});
		form.appendChild(elt('input', {name:'href', type:'text'}));

		let position = topOfNodeSelection(pm);

		openPrompt(pm, form, {pos:position});
	},
	*/
	label: "Add link",
	menu: {group: "inline", rank: 30, display: linkIcon}
});

LinkMarkPilot.prototype.serializeDOM = (mark, s) => s.elt('a', {href:mark.attrs.href});



export default LinkMarkPilot;
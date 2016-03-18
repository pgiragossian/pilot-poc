import {ProseMirror, CommandSet} from 'prosemirror/dist/edit';
import {defaultSchema, Schema, Heading} from 'prosemirror/dist/model';
import {elt} from 'prosemirror/dist/dom';

import 'prosemirror/dist/menu/tooltipmenu';
import 'prosemirror/dist/menu/menubar';
import 'prosemirror/dist/menu/menu';
import {annotationCmd} from './command_annotation';
import LinkMarkPilot from './LinkMarkPilot';



let pilotSchema = new Schema(
	defaultSchema.spec.update(
		{},
		{link: LinkMarkPilot}
	));

function prosemirror($parse) {
		return {
			restrict: 'E',
			require: '?ngModel',
			scope: {
				pmFactory: '=',
			},
			link: function(scope, element, attrs, ngModel) {

				let place = element[0],
						selectedAnnotation = null,
						options = {
							format: 'json',
							schema: pilotSchema,
							place: place,
							menuBar: {float: true},
							tooltipMenu: true,
							commands: CommandSet.default.add(annotationCmd)
						},
						inheritedOptions = $parse(scope.pmFactory.options)(scope) || {};

				options = angular.merge(options, inheritedOptions);

				let pm = new ProseMirror(options);

				pm.mod.tooltipMenu.showLink = function(link, pos) {

					let removeLink = elt("a", {}, 'supprimer');
					removeLink.addEventListener("click", e => {
						let selPos = this.pm.selection.from;
						let chunk = this.pm.doc.firstChild.chunkBefore(selPos.offset);
						var startPos = selPos.move(chunk.start - selPos.offset);
						var endPos = startPos.move(chunk.node.width);
						this.pm.apply(this.pm.tr.removeMark(startPos, endPos));
					});

					let node = elt("div", {class: "ProseMirror-tooltipmenu-linktext"},
											elt("a", {href: link.attrs.href, title: link.attrs.title}, link.attrs.href),
											removeLink
											);
					this.tooltip.open(node, pos)
				};

				if (angular.isDefined(scope.pmFactory)) {
					scope.pmFactory.pm = pm;
					pm.mod.factory = scope.pmFactory;
					scope.pmFactory.restore();
				}

				pm.on('change', function() {
					ngModel.$setViewValue(pm.getContent(options.format), 'change');
				});
				pm.on('blur', function() {
					ngModel.$setViewValue(pm.getContent(options.format), 'blur');
				});

				pm.on('selectionChange', () => {
					selectedAnnotation = null;
					let sel = pm.selection;

					if (sel.from && sel.to) {
						if (sel.from.cmp(sel.to) != 0) {

							/*
							 pm.doc.sliceBetween(sel.from, sel.to).forEach(
							 (node, start, end) => {

							 console.log(node.textContent, node.type, start, end)
							 }
							 )
							 */


						}
						else {
							scope.pmFactory.selectAnnotations(sel.from);
							scope.$apply();
						}
					}
				});

				ngModel.$render = function() {
					if (ngModel.$viewValue) {
						pm.setContent(ngModel.$viewValue, options.format);
					}
				};
			}
		};
}

prosemirror.$inject = ['$parse'];

export default prosemirror;
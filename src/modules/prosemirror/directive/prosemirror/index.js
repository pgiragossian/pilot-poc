import {ProseMirror} from 'prosemirror/dist/edit';
import 'prosemirror/dist/menu/tooltipmenu';
import 'prosemirror/dist/menu/menubar';
import 'prosemirror/dist/menu/menu';
import {defaultSchema, Schema} from 'prosemirror/dist/model'
import annotation from './mark_annotation';

let pilotSchema = new Schema(defaultSchema.spec.update({}, {annotation}));

function prosemirror($parse) {
		return {
			restrict: 'E',
			require: '?ngModel',
			scope: {
				pmEditor: '=?',
				pmOnSelectAnnotation: '=?',
				pmOnResolveAnnotation: '=?'
			},
			link: function(scope, element, attrs, ngModel) {

				let place = element[0],
						selectedAnnotation = null,
						options = {
							schema: pilotSchema,
							format: 'json',
							place: place,
							menuBar: {float: true},
							tooltipMenu: true
						},
						inheritedOptions = $parse(attrs.pmOptions)(scope) || {};

				options = angular.merge(options, inheritedOptions);

				let pm = new ProseMirror(options);

				if (angular.isDefined(scope.pmEditor)) {
					scope.pmEditor = pm;
				}

				if (angular.isDefined(scope.pmOnResolveAnnotation)) {

					scope.pmOnResolveAnnotation = function(hash) {
						console.log('on resolve annotation ' + hash);
					}
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
						if (sel.from.cmp(sel.to) != 0 ) {
							pm.doc.sliceBetween(sel.from, sel.to).forEach(
								(node, start, end) => {
									console.log(node.textContent, node.type, start, end)
								}
							)
						}
						else {
							let marks = pm.doc.marksAt(sel.from);


							marks.forEach(
									(mark) => {
										if (mark.type &&
												mark.type.name === "annotation" &&
												mark.attrs &&
												mark.attrs.hash &&
												angular.isDefined(scope.pmOnSelectAnnotation)) {

											  selectedAnnotation = mark;
										}
									}
							);
						}
					}

					scope.pmOnSelectAnnotation(selectedAnnotation ? selectedAnnotation.attrs.hash : null);
					scope.$apply();

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
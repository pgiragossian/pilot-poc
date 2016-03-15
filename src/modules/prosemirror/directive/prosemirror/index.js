import {ProseMirror, CommandSet} from 'prosemirror/dist/edit';
import 'prosemirror/dist/menu/tooltipmenu';
import 'prosemirror/dist/menu/menubar';
import 'prosemirror/dist/menu/menu';
import {annotationCmd} from './command_annotation';

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
							place: place,
							menuBar: {float: true},
							tooltipMenu: true,
							commands: CommandSet.default.add(annotationCmd)
						},
						inheritedOptions = $parse(scope.pmFactory.options)(scope) || {};

				options = angular.merge(options, inheritedOptions);

				let pm = new ProseMirror(options);

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
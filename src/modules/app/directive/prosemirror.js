import {ProseMirror} from 'prosemirror/dist/edit';
import "prosemirror/dist/menu/tooltipmenu";
import "prosemirror/dist/menu/menubar";

function prosemirror($parse) {
		return {
			restrict: 'E',
			require: '?ngModel',
			link: function(scope, element, attrs, ngModel) {

				var place = element[0];

				var options = {
					place: place,
					menuBar: {float: true}
				};

				var inheritedOptions = $parse(attrs.pmOptions)(scope) || {};

				options = angular.merge(options, inheritedOptions);

				var pm = new ProseMirror(options);

				pm.on('change', function() {
					ngModel.$setViewValue(pm.getContent(options.format), 'change');
				});
				pm.on('blur', function() {
					ngModel.$setViewValue(pm.getContent(options.format), 'blur');
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
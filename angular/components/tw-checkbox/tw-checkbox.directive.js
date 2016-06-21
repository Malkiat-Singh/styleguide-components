
(function(angular) {
	//'use strict';

	angular
		.module('tw.form-components')
		.directive('twCheckbox', TwCheckboxDirective);

	function TwCheckboxDirective() {

		function TwCheckboxController($scope, $element) {
			var $ctrl = this,
				$ngModel = $element.controller('ngModel'),
				buttonElement = $element.find('.tw-checkbox-button');
				labelSelector = '.checkbox';

			$ctrl.buttonClick = function($event) {
				$ngModel.$setViewValue(!$ctrl.ngModel);
				$ngModel.$setTouched();
				var isChecked = !$ctrl.ngModel;

				validateCheckbox(isChecked, $element, $ngModel, $ctrl);
			};
			$ctrl.buttonFocus = function() {
				$element.closest('.checkbox').find('label').addClass('focus');
				$element.trigger('focus');
			};
			$ctrl.buttonBlur = function() {
				$element.closest('.checkbox').find('label').removeClass('focus');
				$element.trigger('blur');
				$ngModel.$setTouched();

				validateCheckbox($ctrl.ngModel, $element, $ngModel, $ctrl);
			};

			$scope.$watch('$ctrl.ngModel', function(newValue, oldValue) {
				if (newValue !== oldValue) {
					$ngModel.$setDirty();
					validateCheckbox($ctrl.ngModel, $element, $ngModel, $ctrl);
				}
			});

			$scope.$watch('$ctrl.ngDisabled', function(newValue, oldValue) {
				if (newValue && !oldValue) {
					$element.closest('.checkbox').addClass('disabled').addClass('disabled', true);
				} else if (!newValue && oldValue) {
					$element.closest('.checkbox').removeClass('disabled').removeClass('disabled');
				}
			});
			$scope.$watch('$ctrl.ngRequired', function(newValue, oldValue) {
				if (newValue !== oldValue && newValue) {
					validateCheckbox($ctrl.ngModel, $element, $ngModel, $ctrl);
				}
			});
		}

		function validateCheckbox(isChecked, $element, $ngModel, $ctrl) {
			if (!$ngModel.$touched) {
				return;
			}

			if (!isChecked && $ctrl.ngRequired) {
				$ngModel.$setValidity('required', false);
				$element.find('.tw-checkbox-button').addClass('has-error');
				$element.closest('.checkbox').addClass('has-error');
				$element.closest('.form-group').addClass('has-error');
			} else {
				$ngModel.$setValidity('required', true);
				$element.find('.tw-checkbox-button').removeClass('has-error');
				$element.closest('.checkbox').removeClass('has-error');
				$element.closest('.form-group').removeClass('has-error');
			}
		}

		return {
			restrict: 'EA',
			require: 'ngModel',
			controller: ['$scope', '$element', TwCheckboxController],
			controllerAs: '$ctrl',
			bindToController: true,
			scope: {
				name: "@",
				ngModel: '=',
				ngRequired: '=',
				ngDisabled: '='
			},
			template: " \
				<input type='hidden' class='sr-only' \
					name='{{$ctrl.name}}' \
					ng-model='$ctrl.ngModel' \
					ng-disabled='$ctrl.ngDisabled'/> \
				<button type='button' class='tw-checkbox-button' tw-focusable \
					ng-click='$ctrl.buttonClick($event)' \
					ng-focus='$ctrl.buttonFocus()' \
					ng-blur='$ctrl.buttonBlur()' \
					ng-disabled='$ctrl.ngDisabled' \
					ng-class='{\"checked\": $ctrl.ngModel}' \
					aria-pressed='{{$ctrl.ngModel}}'> \
					<span class='tw-checkbox-check glyphicon glyphicon-ok'></span> \
				</button>"
		};
		/* <span class='tw-checkbox-check'></span> \ */
	}
})(window.angular);

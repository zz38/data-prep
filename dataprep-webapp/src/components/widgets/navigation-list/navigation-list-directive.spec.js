describe('navigationList directive', function() {
	'use strict';

	var scope, createElement, element;

	var list = [
		{
			'label': 'us-customers-500'
		},
		{
			'label': 'dates'
		},
		{
			'label': 'exponnetial'
		}
	];

	beforeEach(module('talend.widget'));
	beforeEach(module('htmlTemplates'));

	describe('when list has 3 items and number of shown labels 2', function(){

		beforeEach(inject(function($rootScope, $compile) {
			scope = $rootScope.$new();
			createElement = function() {
				element = angular.element('<navigation-list ' +
					'list="list"' +
					'on-click="trigger(item)"' +
					'selected-item="item"' +
					'get-label="getLabelCb(item)"' +
					'></navigation-list>'
				);
				scope.list = list;
				scope.item = list[0];
				scope.getLabelCb = function(item){
					return item.label;
				};

				$compile(element)(scope);
				scope.$digest();
			};
		}));

		afterEach(function() {
			scope.$destroy();
			element.remove();
		});

		it('should render items list', function() {
			//when
			createElement();

			//then
			expect(element.find('.navigation-list').length).toBe(1);
			expect(element.find('button').length).toBe(2);
			expect(element.find('.items-list').length).toBe(1);
			expect(element.find('.item-label').length).toBe(3);
			expect(element.find('.item-label').eq(0).text().trim()).toBe('us-customers-500');
			expect(element.find('.item-label').eq(1).text().trim()).toBe('dates');
			expect(element.find('.item-label').eq(2).text().trim()).toBe('exponnetial');
			expect(element.find('.selected-item-label').length).toBe(1);
			expect(element.find('.selected-item-label').eq(0).text().trim()).toBe('us-customers-500');
		});

		it('should trigger item selection callback', function() {
			//given
			scope.trigger = jasmine.createSpy('clickCb');
			createElement();

			//when
			element.find('.item-label').eq(1).click();

			//then
			expect(scope.trigger).toHaveBeenCalledWith(list[1]);
		});
	});
});
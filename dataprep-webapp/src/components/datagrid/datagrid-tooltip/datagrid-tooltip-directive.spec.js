describe('Datagrid tooltip directive', function() {
    'use strict';
    var scope, element;

    beforeEach(module('data-prep.datagrid-tooltip'));
    beforeEach(module('htmlTemplates'));

    beforeEach(inject(function($rootScope, $compile, $window) {
        scope = $rootScope.$new();
        element = angular.element('<datagrid-tooltip record="record" key="colId" position="position" requested-state="showTooltip"></datagrid-tooltip>');
        $compile(element)(scope);
        scope.$digest();

        //angular.element('body').append(element);
        $window.innerWidth = 1920;
        $window.innerHeight = 1080;
    }));

    afterEach(function() {
        scope.$destroy();
        element.remove();
    });

    it('should display tooltip with the right content', function() {
        //given
        scope.record = {id: 'd589Bc827b8e7bc2', name: '    Toto aux toilettes'};
        scope.colId = 'name';
        scope.showTooltip = true;

        expect(element.find('.datagrid-tooltip').hasClass('ng-hide')).toBe(true);
        //when
        scope.$digest();

        //then
        expect(element.find('.datagrid-tooltip').hasClass('ng-hide')).toBe(false);
        expect(element.find('.datagrid-tooltip-content').eq(0).text()).toBe('    Toto aux toilettes');
    });
});
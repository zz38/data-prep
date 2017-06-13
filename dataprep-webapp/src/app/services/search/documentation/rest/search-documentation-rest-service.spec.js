/*  ============================================================================

 Copyright (C) 2006-2016 Talend Inc. - www.talend.com

 This source code is available under agreement available at
 https://github.com/Talend/data-prep/blob/master/LICENSE

 You should have received a copy of the agreement
 along with this program; if not, write to Talend SA
 9 rue Pages 92150 Suresnes, France

 ============================================================================*/
import docSearchResults from '../../../../../mocks/Documentation.mock';

describe('Search Documentation Rest Service', () => {
	let $httpBackend;

	beforeEach(angular.mock.module('data-prep.services.search.documentation'));

	beforeEach(inject(($rootScope, $injector) => {
		$httpBackend = $injector.get('$httpBackend');
	}));

	it('should call external documentation rest service ',
		inject(($rootScope, SearchDocumentationRestService, documentationSearchURL) => {
		// given
		const keyword = 'chart';
		let result = null;
		$httpBackend
			.expectPOST(documentationSearchURL)
			.respond(200, docSearchResults);

		// when
		SearchDocumentationRestService.search(keyword).then((response) => {
			result = response.data;
		});
		$httpBackend.flush();
		$rootScope.$digest();

		// then
		expect(result).toEqual(docSearchResults);
	}));
});

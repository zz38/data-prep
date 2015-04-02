/*jshint camelcase: false */

describe('Recipe service', function () {
    'use strict';

    var preparationDetails = {
        'id': '627766216e4b3c99ee5c8621f32ac42f4f87f1b4',
        'dataSetId': 'db6c4ad8-77da-4a30-b29f-ca552706b058',
        'author': 'anonymousUser',
        'name': 'JSO prep',
        'creationDate': 1427980028390,
        'lastModificationDate': 1427980216038,
        'steps': [
            '2aba0e60054728f046d35315830bce9abc3c5249',
            '1e1f41dd6d4554705abebd8d1896022acdbad217',
            '0c58ee3034114eb620b8e598e02c74172a43e96a',
            'ec87e2acda2b181fc7eb7c22d91e128c6d0434fc',
            '329ccf0cce42db4dc0ffa9f389c05ff7d75c1748',
            'f6e172c33bdacbc69bca9d32b2bd78174712a171'
        ],
        'actions': [
            {
                'action': 'uppercase',
                'parameters': {
                    'column_name': 'country'
                }
            },
            {
                'action': 'fillemptywithdefault',
                'parameters': {
                    'default_value': 'M',
                    'column_name': 'gender'
                }
            },
            {
                'action': 'negate',
                'parameters': {
                    'column_name': 'campain'
                }
            },
            {
                'action': 'cut',
                'parameters': {
                    'pattern': '.',
                    'column_name': 'first_item'
                }
            },
            {
                'action': 'fillemptywithdefaultboolean',
                'parameters': {
                    'default_value': 'True',
                    'column_name': 'campain'
                }
            }
        ],
        'metadata': [
            {
                'compatibleColumnTypes': [
                    'STRING'
                ],
                'category': 'case',
                'items': [],
                'name': 'uppercase',
                'parameters': [
                    {
                        'name': 'column_name',
                        'type': 'string',
                        'description': 'parameter.column_name.desc',
                        'label': 'parameter.column_name.label',
                        'default': ''
                    }
                ],
                'description': 'action.uppercase.desc',
                'label': 'action.uppercase.label'
            },
            {
                'compatibleColumnTypes': [
                    'STRING'
                ],
                'items': [],
                'name': 'fillemptywithdefault',
                'parameters': [
                    {
                        'name': 'column_name',
                        'type': 'string',
                        'description': 'parameter.column_name.desc',
                        'label': 'parameter.column_name.label',
                        'default': ''
                    },
                    {
                        'name': 'default_value',
                        'type': 'string',
                        'description': 'parameter.default_value.desc',
                        'label': 'parameter.default_value.label',
                        'default': ''
                    }
                ],
                'category': 'repair',
                'description': 'action.fillemptywithdefault.desc',
                'label': 'action.fillemptywithdefault.label'
            },
            {
                'compatibleColumnTypes': [
                    'BOOLEAN'
                ],
                'category': 'boolean',
                'items': [],
                'name': 'negate',
                'parameters': [
                    {
                        'name': 'column_name',
                        'type': 'string',
                        'description': 'parameter.column_name.desc',
                        'label': 'parameter.column_name.label',
                        'default': ''
                    }
                ],
                'description': 'action.negate.desc',
                'label': 'action.negate.label'
            },
            {
                'compatibleColumnTypes': [
                    'STRING'
                ],
                'category': 'repair',
                'items': [],
                'name': 'cut',
                'parameters': [
                    {
                        'name': 'column_name',
                        'type': 'string',
                        'description': 'parameter.column_name.desc',
                        'label': 'parameter.column_name.label',
                        'default': ''
                    },
                    {
                        'name': 'pattern',
                        'type': 'string',
                        'description': 'parameter.pattern.desc',
                        'label': 'parameter.pattern.label',
                        'default': ''
                    }
                ],
                'description': 'action.cut.desc',
                'label': 'action.cut.label'
            },
            {
                'compatibleColumnTypes': [
                    'BOOLEAN'
                ],
                'items': [
                    {
                        'name': 'default_value',
                        'category': 'categ',
                        'values': [
                            {
                                'name': 'True',
                                'parameters': [],
                                'default': true
                            },
                            {
                                'name': 'False',
                                'parameters': [],
                                'default': false
                            }
                        ],
                        'description': 'parameter.default_value.desc',
                        'label': 'parameter.default_value.label'
                    }
                ],
                'name': 'fillemptywithdefaultboolean',
                'parameters': [
                    {
                        'name': 'column_name',
                        'type': 'string',
                        'description': 'parameter.column_name.desc',
                        'label': 'parameter.column_name.label',
                        'default': ''
                    }
                ],
                'category': 'repair',
                'description': 'action.fillemptywithdefaultboolean.desc',
                'label': 'action.fillemptywithdefaultboolean.label'
            }
        ]
    };

    beforeEach(module('data-prep.services.recipe'));
    beforeEach(inject(function($q, PreparationService) {
        spyOn(PreparationService, 'getDetails').and.returnValue($q.when({
            data: preparationDetails
        }));
    }));

    it('should reset recipe item list', inject(function(RecipeService) {
        //given
        RecipeService.getRecipe()[0] = {};
        expect(RecipeService.getRecipe().length).toBeTruthy();

        //when
        RecipeService.reset();

        //then
        expect(RecipeService.getRecipe().length).toBe(0);
    }));

    it('should get recipe from preparation and init recipe items/params', inject(function($rootScope, RecipeService) {
        //given

        //when
        RecipeService.refresh();
        $rootScope.$digest();

        //then
        var recipe = RecipeService.getRecipe();
        expect(recipe.length).toBe(5);
        expect(recipe[0].column.id).toBe('country');
        expect(recipe[0].transformation.stepId).toBe('1e1f41dd6d4554705abebd8d1896022acdbad217');
        expect(recipe[0].transformation.name).toBe('uppercase');
        expect(recipe[0].transformation.parameters).toEqual([]);
        expect(recipe[0].transformation.items).toEqual([]);

        expect(recipe[1].column.id).toBe('gender');
        expect(recipe[1].transformation.stepId).toBe('0c58ee3034114eb620b8e598e02c74172a43e96a');
        expect(recipe[1].transformation.name).toBe('fillemptywithdefault');
        expect(recipe[1].transformation.items).toEqual([]);
        expect(recipe[1].transformation.parameters).toEqual([
            {
                name: 'default_value',
                type: 'string',
                description: 'parameter.default_value.desc',
                label: 'parameter.default_value.label',
                default: '',
                initialValue: 'M',
                value: 'M',
                inputType: 'text'
            }]);

        expect(recipe[2].column.id).toBe('campain');
        expect(recipe[2].transformation.stepId).toBe('ec87e2acda2b181fc7eb7c22d91e128c6d0434fc');
        expect(recipe[2].transformation.name).toBe('negate');
        expect(recipe[2].transformation.parameters).toEqual([]);
        expect(recipe[2].transformation.items).toEqual([]);

        expect(recipe[3].column.id).toBe('first_item');
        expect(recipe[3].transformation.stepId).toBe('329ccf0cce42db4dc0ffa9f389c05ff7d75c1748');
        expect(recipe[3].transformation.name).toBe('cut');
        expect(recipe[3].transformation.items).toEqual([]);
        expect(recipe[3].transformation.parameters).toEqual([
            {
                name: 'pattern',
                type: 'string',
                description: 'parameter.pattern.desc',
                label: 'parameter.pattern.label',
                default: '',
                initialValue: '.',
                value: '.',
                inputType: 'text'
            }]);

        expect(recipe[4].column.id).toBe('campain');
        expect(recipe[4].transformation.stepId).toBe('f6e172c33bdacbc69bca9d32b2bd78174712a171');
        expect(recipe[4].transformation.name).toBe('fillemptywithdefaultboolean');
        expect(recipe[4].transformation.parameters).toEqual([]);
        expect(recipe[4].transformation.items).toEqual([
            {
                name: 'default_value',
                category: 'categ',
                values: [
                    { name: 'True', parameters: [], default: true },
                    { name: 'False', parameters: [], default: false }
                ],
                description: 'parameter.default_value.desc',
                label: 'parameter.default_value.label',
                type: 'LIST',
                initialValue: { name: 'True', parameters: [], default: true },
                selectedValue: { name: 'True', parameters: [], default: true }
            }]);
    }));

    it('should reset current values to initial saved values in param', inject(function(RecipeService) {
        //given
        var column = {id: 'colId'};
        var transformation = {
            stepId: '329ccf0cce42db4dc0ffa9f389c05ff7d75c1748',
            name: 'cut',
            items: [
                {
                    name: 'mode',
                    type: 'LIST',
                    values: [
                        {
                            name: 'regex',
                            parameters : [
                                {name: 'regex', type: 'text', initialValue: 'param1Value'},
                                {name: 'comment', type: 'text', initialValue: 'my comment'}
                            ]
                        },
                        {name: 'index'}
                    ]
                }
            ],
            parameters: [
                {
                    name: 'param1',
                    type: 'string',
                    initialValue: 'myParam1',
                    inputType: 'text'
                },
                {
                    name: 'param2',
                    type: 'integer',
                    initialValue: 5,
                    inputType: 'number'
                }
            ]
        };
        transformation.items[0].initialValue = transformation.items[0].values[1];

        RecipeService.getRecipe().push({
            column: column,
            transformation: transformation
        });
        var recipe = RecipeService.getRecipe();
        recipe[0].transformation.parameters[0].value = 'myNewParam1';
        recipe[0].transformation.parameters[1].value = 6;
        recipe[0].transformation.items[0].selectedValue = transformation.items[0].values[0];
        recipe[0].transformation.items[0].values[0].parameters[0].value = 'newParam1Value';
        recipe[0].transformation.items[0].values[0].parameters[1].value = 'myNewcomment';

        //when
        RecipeService.resetParams(recipe[0]);

        //then
        expect(recipe[0].transformation.parameters[0].initialValue).toBe('myParam1');
        expect(recipe[0].transformation.parameters[1].initialValue).toBe(5);
        expect(recipe[0].transformation.items[0].initialValue).toBe(recipe[0].transformation.items[0].values[1]);
        expect(recipe[0].transformation.items[0].values[0].parameters[0].initialValue).toBe('param1Value');
        expect(recipe[0].transformation.items[0].values[0].parameters[1].initialValue).toBe('my comment');
    }));
});
// questions
// can non-text fields be localized?

import { CollectionConfig, Field, TextField } from 'payload/types';
import * as R from 'ramda';

const getLocalizedFields = (configuration: CollectionConfig) =>
    getLocalizedFieldsRecursively([], configuration.fields);

const isLocalizedText = (field: Field): boolean =>
    field.type === 'text' && field.localized;

const isNested = (field: Field): boolean => R.has('fields', field);

interface NestedField {
    name: string;
    fields: Field[];
}

const getLocalizedFieldsRecursively = (
    path: string[],
    fields: Field[]
): string[][] => {
    const reduceLocalizedField = (acc: string[][], textField: TextField) => [
        ...acc,
        [...path, textField.name],
    ];

    const localizedFields = R.filter(isLocalizedText, fields);
    const results = R.reduce(reduceLocalizedField, [], localizedFields);

    const reduceNestedField = (acc: string[][], nestedField: NestedField) => {
        const p = [...path, nestedField.name];
        const f = nestedField.fields;
        return [...acc, ...getLocalizedFieldsRecursively(p, f)];
    };

    const nestedFields: NestedField[] = R.filter(isNested, fields);
    return R.reduce(reduceNestedField, results, nestedFields);
};

const getLocalizedValues = (paths: string[][], object: any): string[] => {
    let result = [];
    paths.forEach((path: string[]) => {
        const r = getLocalizedValuesRecursively(path, object);
        result = R.flatten(R.append(r, result));
    });
    return result;
};

const getLocalizedValuesRecursively = (
    path: string[],
    object: any
): string[] => {
    if (R.isEmpty(path)) {
        return [];
    }
    if (R.is(Array, object[path[0]])) {
        let result = [];
        object[path[0]].forEach((element: any) => {
            const r = getLocalizedValuesRecursively(R.drop(1, path), element);
            result = [...result, r];
        });
        return result;
    }
    if (path.length === 1) {
        return R.is(String, object[path[0]]) ? object[path[0]] : undefined;
    }
    return getLocalizedValuesRecursively(R.drop(1, path), object[path[0]]);
};

describe('extract POT data', () => {
    describe('find localized fields', () => {
        it('returns nothing for a collection with no localized fields', () => {
            const configuration: CollectionConfig = {
                slug: 'foo',
                fields: [
                    {
                        name: 'bar',
                        type: 'number',
                    },
                    {
                        name: 'baz',
                        type: 'text',
                    },
                    {
                        name: 'bazzo',
                        type: 'text',
                        localized: false,
                    },
                ],
            };
            const fields = getLocalizedFields(configuration);
            expect(fields).toEqual([]);
        });
        it('returns name of localized string', () => {
            const configuration: CollectionConfig = {
                slug: 'foo',
                fields: [
                    {
                        name: 'bar',
                        type: 'text',
                        localized: true,
                    },
                ],
            };
            const fields = getLocalizedFields(configuration);
            expect(fields).toEqual([['bar']]);
        });
        it('returns names of multiple localized string fields', () => {
            const configuration: CollectionConfig = {
                slug: 'foo',
                fields: [
                    {
                        name: 'bar',
                        type: 'text',
                        localized: true,
                    },
                    {
                        name: 'baz',
                        type: 'text',
                        localized: true,
                    },
                    {
                        name: 'bazzo',
                        type: 'number',
                    },
                ],
            };
            const fields = getLocalizedFields(configuration);
            expect(fields).toEqual([['bar'], ['baz']]);
        });
        describe('configuration with nested fields', () => {
            it('extracts name with path of localized field in array', () => {
                const configuration: CollectionConfig = {
                    slug: 'foo',
                    fields: [
                        {
                            name: 'bar',
                            type: 'array',
                            fields: [
                                {
                                    name: 'baz',
                                    type: 'text',
                                    localized: true,
                                },
                            ],
                        },
                    ],
                };
                const fields = getLocalizedFields(configuration);
                expect(fields).toEqual([['bar', 'baz']]);
            });
            it('extracts name of field inside a group', () => {
                const configuration: CollectionConfig = {
                    slug: 'foo',
                    fields: [
                        {
                            name: 'bar',
                            type: 'group',
                            fields: [
                                {
                                    name: 'baz',
                                    type: 'text',
                                    localized: true,
                                },
                            ],
                        },
                    ],
                };
                const fields = getLocalizedFields(configuration);
                expect(fields).toEqual([['bar', 'baz']]);
            });
            it('extracts name with path for multiple fields inside array', () => {
                const configuration: CollectionConfig = {
                    slug: 'foo',
                    fields: [
                        {
                            name: 'bar',
                            type: 'array',
                            fields: [
                                {
                                    name: 'baz',
                                    type: 'text',
                                    localized: true,
                                },
                                {
                                    name: 'bazzo',
                                    type: 'text',
                                    localized: true,
                                },
                            ],
                        },
                    ],
                };
                const fields = getLocalizedFields(configuration);
                expect(fields).toEqual([
                    ['bar', 'baz'],
                    ['bar', 'bazzo'],
                ]);
            });
        });
    });
    describe('pull localized values from objects', () => {
        it('pulls a value from simple object', () => {
            const object = {
                firstField: 'firstValue',
            };
            const result = getLocalizedValues([['firstField']], object);
            expect(result).toEqual(['firstValue']);
        });
        it('handles empty path array', () => {
            const object = {
                firstField: 'firstValue',
            };
            expect(getLocalizedValues([], object)).toEqual([]);
            expect(getLocalizedValues([[]], object)).toEqual([]);
        });
        it('pulls value from a nested field', () => {
            const object = {
                firstField: {
                    secondField: 'firstValue',
                },
            };
            const result = getLocalizedValues(
                [['firstField', 'secondField']],
                object
            );
            expect(result).toEqual(['firstValue']);
        });
        it('pulls multiple values from simple object', () => {
            const object = {
                firstField: 'firstValue',
                secondField: 'secondValue',
            };
            const result = getLocalizedValues(
                [['firstField'], ['secondField']],
                object
            );
            expect(result).toEqual(['firstValue', 'secondValue']);
        });
        it('pulls values from an array', () => {
            const object = {
                firstField: [
                    {
                        secondField: 3,
                        thirdField: 'firstValue',
                    },
                    {
                        secondField: 4,
                        thirdField: 'secondValue',
                    },
                ],
            };
            const result = getLocalizedValues(
                [['firstField', 'thirdField']],
                object
            );
            expect(result).toEqual(['firstValue', 'secondValue']);
        });
        it('handles error where the path array is too short', () => {
            const object = {
                firstField: {
                    secondField: 'firstValue',
                },
            };
            const result = getLocalizedValues([['firstField']], object);
            expect(result).toEqual([undefined]);
        });
        it('handles error where the path array is too long', () => {
            const object = {
                firstField: {
                    secondField: 'firstValue',
                },
            };
            const result = getLocalizedValues(
                [['firstField', 'secondField', 'thirdField']],
                object
            );
            expect(result).toEqual([undefined]);
        });
    });
});

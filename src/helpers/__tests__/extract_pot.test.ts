// questions
// can non-text fields be localized?

import { CollectionConfig, Field, TextField } from 'payload/types';
import * as R from 'ramda';

const findLocalizedFields = (configuration: CollectionConfig) =>
    findRecursively([], configuration.fields);

const findRecursively = (path: string[], fields: Field[]): string[][] => {
    const isLocalizedText = (field: Field) =>
        field.type === 'text' && field.localized;
    const localizedFields = R.filter(isLocalizedText, fields);
    let results = [];
    localizedFields.forEach((field: TextField) => {
        results = [...results, [...path, field.name]];
    });

    interface NestedField {
        name: string;
        fields: Field[];
    }

    const isNested = (field: Field): boolean => R.has('fields', field);
    const nestedFields: NestedField[] = R.filter(isNested, fields);
    nestedFields.forEach((nestedField) => {
        const found = findRecursively(
            [...path, nestedField.name],
            nestedField.fields
        );
        results = [...results, ...found];
    });
    return results;
};

const getLocalizedValues = (paths: string[][], object: any): string[] => {
    let result = [];
    paths.forEach((path: string[]) => {
        const r = recurse(path, object);
        console.log('H9 got ' + JSON.stringify(r));
        result = R.flatten(R.append(r, result));
        console.log('H99 resulted in ' + JSON.stringify(result));
    });
    return result;
};

const recurse = (path: string[], object: any): string[] => {
    if (R.isEmpty(path)) {
        return [];
    }
    if (R.is(Array, object[path[0]])) {
        let result = [];
        R.forEach((element: any) => {
            const resultFromElement = recurse(R.drop(1, path), element);
            result = [...result, resultFromElement];
        }, object[path[0]]);
        return result;
    }
    if (path.length === 1) {
        return object[path[0]];
    }
    return recurse(R.drop(1, path), object[path[0]]);
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
            const fields = findLocalizedFields(configuration);
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
            const fields = findLocalizedFields(configuration);
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
            const fields = findLocalizedFields(configuration);
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
                const fields = findLocalizedFields(configuration);
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
                const fields = findLocalizedFields(configuration);
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
                const fields = findLocalizedFields(configuration);
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
    });
});

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

const formatPoData = (data: string[]): string =>
    R.reduce(
        (acc: string, item: string) => `${acc}msgid "${item}"\nmsgstr ""\n\n`,
        '',
        data
    );

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
    describe('write localized values to POT file', () => {
        it('formats a couple of values', () => {
            const data = ['first value', 'second value'];
            const expectedData =
                'msgid "first value"\n' +
                'msgstr ""\n' +
                '\n' +
                'msgid "second value"\n' +
                'msgstr ""\n' +
                '\n';
            const formattedData = formatPoData(data);
            expect(formattedData).toEqual(expectedData);
        });
    });
    describe('updates localized fiels from gettext call', () => {
        it('handles a simple case', () => {
            const configuration: CollectionConfig = {
                slug: 'foo',
                fields: [
                    { name: 'id', type: 'text' },
                    { name: 'firstField', type: 'text', localized: true },
                ],
            };
            const object = { id: '123', firstField: 'firstValue' };
            const mockGetText = (value: string): string => 'premierValeur';

            const result = computeUpdate(mockGetText, configuration, object);

            expect(result).toEqual({ id: '123', firstField: 'premierValeur' });
        });
        it('handles object with two localized fields', () => {
            const configuration: CollectionConfig = {
                slug: 'foo',
                fields: [
                    { name: 'id', type: 'text' },
                    { name: 'firstField', type: 'text', localized: true },
                    { name: 'secondField', type: 'text', localized: true },
                ],
            };
            const object = {
                id: '123',
                firstField: 'firstValue',
                secondField: 'secondValue',
            };
            const mockGetText = (value: string): string =>
                value === 'firstValue' ? 'foersteVerdi' : 'andreVerdi';

            const result = computeUpdate(mockGetText, configuration, object);

            expect(result).toEqual({
                id: '123',
                firstField: 'foersteVerdi',
                secondField: 'andreVerdi',
            });
        });
        it('handles object with nested fields', () => {
            const configuration: CollectionConfig = {
                slug: 'foo',
                fields: [
                    { name: 'id', type: 'text' },
                    {
                        name: 'firstField',
                        type: 'array',
                        fields: [
                            { name: 'id', type: 'text' },
                            {
                                name: 'secondField',
                                type: 'text',
                                localized: true,
                            },
                        ],
                    },
                ],
            };
            const object = {
                id: '123',
                firstField: [{ id: '234', secondField: 'secondValue' }],
            };
            // TODO have mock throw on unexpected argument
            const mockGetText = (value: string): string => 'andreVerdi';
            const result = computeUpdate(mockGetText, configuration, object);

            expect(result).toEqual({
                id: '123',
                firstField: [{ id: '234', secondField: 'andreVerdi' }],
            });
        });
    });
});

const computeUpdate = (
    getText: (v: string) => string,
    configuration: CollectionConfig,
    object: any
) => {
    let result = { id: object['id'] };
    const fields = getLocalizedFields(configuration);
    fields.forEach((path: string[]) => {
        const r = computeUpdateRecursively(getText, path, object);
        result = { ...result, ...r };
    });
    return result;
};

const computeUpdateRecursively = (
    getText: (v: string) => string,
    path: string[],
    object: any
) => {
    const fieldName = path[0];
    const oldValue = object[fieldName];
    const newValue = getText(oldValue);
    return { [fieldName]: newValue };
};

const computeUpdateDraft = (
    getText: (v: string) => string,
    configuration: CollectionConfig,
    object: any
) => {
    const fields = getLocalizedFields(configuration);
    let result = {};
    fields.forEach((path: string[]) => {
        const r = computeUpdateRecursivelyDraft(getText, path, object);
        result = { ...result, r };
    });
    return result;
};

const computeUpdateRecursivelyDraft = (
    getText: (v: string) => string,
    path: string[],
    object: any
): any => {
    if (path.length === 0) {
        return undefined;
    }
    if (path.length === 1) {
        const oldValue = object[path[0]];
        const newValue = getText(oldValue);
        return { id: object['id'], [path[0]]: newValue };
    }
    const p = R.drop(1, path);
    const o = object[path[0]];
    const r = computeUpdateRecursivelyDraft(getText, p, o);
    return r; // TODO needs to put path[0] in front of each element?
};

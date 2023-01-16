import { CollectionConfig } from 'payload/types';
import { getLocalizedFields } from '../get_localized_fields';
import { getLocalizedValues } from '../get_localized_values';
import { updateLocalizedValues } from '../update_localized_values';
import { formatPoData } from '../format_po_data';

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
        it('returns name of localized field', () => {
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
    describe('pull localizable values from objects', () => {
        it('pulls a value from simple object', () => {
            const object = {
                firstField: 'first Value',
            };
            const result = getLocalizedValues([['firstField']], object);
            expect(result).toEqual([
                { value: 'first Value', breadCrumbs: ['firstField'] },
            ]);
        });
        it('handles empty path array', () => {
            const object = {
                firstField: 'first Value',
            };
            expect(getLocalizedValues([], object)).toEqual([]);
            expect(getLocalizedValues([[]], object)).toEqual([]);
        });
        it('pulls value from a nested field', () => {
            const object = {
                firstField: {
                    secondField: 'first Value',
                },
            };
            const result = getLocalizedValues(
                [['firstField', 'secondField']],
                object
            );
            expect(result).toEqual([
                {
                    value: 'first Value',
                    breadCrumbs: ['firstField', 'secondField'],
                },
            ]);
        });
        it('pulls multiple values from simple object', () => {
            const object = {
                firstField: 'first Value',
                secondField: 'second Value',
            };
            const result = getLocalizedValues(
                [['firstField'], ['secondField']],
                object
            );
            expect(result).toEqual([
                { value: 'first Value', breadCrumbs: ['firstField'] },
                { value: 'second Value', breadCrumbs: ['secondField'] },
            ]);
        });
        it('pulls values from an array', () => {
            const object = {
                firstField: [
                    {
                        secondField: 3,
                        thirdField: 'first Value',
                    },
                    {
                        secondField: 4,
                        thirdField: 'second Value',
                    },
                ],
            };
            const result = getLocalizedValues(
                [['firstField', 'thirdField']],
                object
            );
            expect(result).toEqual([
                {
                    value: 'first Value',
                    breadCrumbs: ['firstField', '0', 'thirdField'],
                },
                {
                    value: 'second Value',
                    breadCrumbs: ['firstField', '1', 'thirdField'],
                },
            ]);
        });
        it('handles error where the path array is too short', () => {
            const object = {
                firstField: {
                    secondField: 'first Value',
                },
            };
            const result = getLocalizedValues([['firstField']], object);
            expect(result).toEqual([undefined]);
        });
        it('handles error where the path array is too long', () => {
            const object = {
                firstField: {
                    secondField: 'first Value',
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
            const expectedData = [
                'msgid "first value"',
                'msgstr ""',
                '',
                'msgid "second value"',
                'msgstr ""',
                '',
                '',
            ].join('\n');
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
            const object = { id: '123', firstField: 'first Value' };

            const getText = mockGetText({ 'first Value': 'foerste Verdi' });
            const result = updateLocalizedValues(getText, configuration, object);

            expect(result).toEqual({ id: '123', firstField: 'foerste Verdi' });
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
                firstField: 'first Value',
                secondField: 'second Value',
            };
            const getText = mockGetText({
                'first Value': 'foerste Verdi',
                'second Value': 'andre Verdi',
            });
            const result = updateLocalizedValues(getText, configuration, object);

            expect(result).toEqual({
                id: '123',
                firstField: 'foerste Verdi',
                secondField: 'andre Verdi',
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
                firstField: [
                    { id: '234', secondField: 'second Value' },
                    { id: '345', secondField: 'third Value' },
                ],
            };
            const getText = mockGetText({
                'second Value': 'andre Verdi',
                'third Value': 'tredje Verdi',
            });
            const result = updateLocalizedValues(getText, configuration, object);

            console.log(JSON.stringify(result, null, 4));

            expect(result).toEqual({
                id: '123',
                firstField: [
                    { id: '234', secondField: 'andre Verdi' },
                    { id: '345', secondField: 'tredje Verdi' },
                ],
            });
        });
    });
});

type GetTextFunction = (value: string) => string;

const mockGetText = (map: Record<string, string>): GetTextFunction => {
    return (value: string) => {
        const mappedValue = map[value];
        if (!mappedValue) {
            throw new Error(`Invalid value passed to mock getText: ${value}`);
        }
        return mappedValue;
    };
};

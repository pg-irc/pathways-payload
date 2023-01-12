// questions
// can non-text fields be localized?

import { CollectionConfig, Field, TextField, ArrayField } from 'payload/types';
import * as R from 'ramda';

const findLocalizedFields = (configuration: CollectionConfig) =>
    findRecursively(configuration.fields);

const findRecursively = (fields: Field[]): string[] => {
    const isLocalizedText = (field: Field) =>
        field.type === 'text' && field.localized;
    const localizedFields = R.filter(isLocalizedText, fields);
    let results = [];
    localizedFields.forEach((field: TextField) => {
        results = [...results, field.name];
    });
    const isArray = (field: Field): boolean => field.type === 'array';
    const arrayFields = R.filter(isArray, fields);
    arrayFields.forEach((field: ArrayField) => {
        const found = findRecursively(field.fields);
        results = [...results, ...found];
    });
    return results;
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
            expect(fields).toEqual(['bar']);
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
            expect(fields).toEqual(['bar', 'baz']);
        });
        describe('configuration with nested fields', () => {
            it('extracts name of localized field in array', () => {
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
                expect(fields).toEqual(['baz']);
            });
        });
    });
});

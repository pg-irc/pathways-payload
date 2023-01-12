import { CollectionConfig, Field, TextField } from 'payload/types';
import * as R from 'ramda';

const findLocalizedFields = (configuration: CollectionConfig) => {
    const fields = configuration.fields;
    const localizedFields = R.filter(
        (field: Field) => field.type === 'text' && field.localized,
        fields
    );
    const results = [];
    localizedFields.forEach((field: TextField) => {
        results.push(field.name);
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
    });
});

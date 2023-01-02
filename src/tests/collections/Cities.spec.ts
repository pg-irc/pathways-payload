import { FieldHook } from 'payload/types';

const setMetaDataReference = (metaDataId: string): FieldHook => {
    const hook: FieldHook = async ({ value, data }) => metaDataId;
    return hook;
};

interface CccValue {
    name: string;
    type: string;
    relationTo?: string;
    hasMany?: boolean;
    hooks?: any;
    admin?: any;
    localized?: boolean;
}

interface CccDataSet {
    name: string;
    type: 'group';
    fields: CccValue[];
}

class CccDatasetBuilder {
    dataSets: CccDataSet[];
    constructor() {
        this.dataSets = [];
    }
    addDataSet(name: string): CccDatasetBuilder {
        this.dataSets = [
            ...this.dataSets,
            {
                name,
                type: 'group',
                fields: [
                    {
                        name: 'meta-data',
                        type: 'relationship',
                        relationTo: 'group-meta-data',
                        hasMany: false,
                        hooks: { beforeChange: [setMetaDataReference(name)] },
                        admin: { hidden: true },
                    },
                ],
            },
        ];
        return this;
    }
    withTextValue(name: string): CccDatasetBuilder {
        const lastDataSet = this.dataSets[this.dataSets.length - 1];
        this.dataSets[this.dataSets.length - 1] = {
            ...lastDataSet,
            fields: [
                ...lastDataSet.fields,
                { name, type: 'string', localized: true },
            ],
        };
        return this;
    }
    withNumericValue(name: string, _unit: string): CccDatasetBuilder {
        const lastDataSet = this.dataSets[this.dataSets.length - 1];
        this.dataSets[this.dataSets.length - 1] = {
            ...lastDataSet,
            fields: [...lastDataSet.fields, { name, type: 'number' }],
        };
        return this;
    }
    buildAllDataSets(): CccDataSet[] {
        return this.dataSets;
    }
}

export const buildCityComparableData = (): any =>
    new CccDatasetBuilder()
        .addDataSet('climate')
        .withNumericValue('summer-low', 'centigrade')
        .withNumericValue('summer-high', 'centigrade')
        .withNumericValue('winter-low', 'centigrade')
        .withNumericValue('winter-high', 'centigrade')
        .addDataSet('people')
        .withNumericValue('population', 'people')
        .withNumericValue('percent-english-speakers', 'percent')
        .buildAllDataSets();

describe('CCC data set builder', () => {
    describe('building a data set', () => {
        let result: CccDataSet[] = undefined;
        beforeEach(() => {
            result = new CccDatasetBuilder()
                .addDataSet('climate')
                .buildAllDataSets();
        });
        it('sets the data set name', () => {
            expect(result[0].name).toEqual('climate');
        });
        it('sets the data set type to "group"', () => {
            expect(result[0].type).toEqual('group');
        });
        it('creates field to hold the relationship to the metadata', () => {
            expect(result[0].fields[0].name).toEqual('meta-data');
        });
        it('sets the field type to "relationship"', () => {
            expect(result[0].fields[0].type).toEqual('relationship');
        });
        it('sets the field relation to', () => {
            expect(result[0].fields[0].relationTo).toEqual('group-meta-data');
        });
        it('sets the field hasMany to false', () => {
            expect(result[0].fields[0].hasMany).toEqual(false);
        });
        it('sets the field hidden to true', () => {
            expect(result[0].fields[0].admin).toEqual({ hidden: true });
        });
        it('can create two groups', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('foo')
                .addDataSet('bar')
                .buildAllDataSets();
            expect(result[0].name).toEqual('foo');
            expect(result[1].name).toEqual('bar');
        });
    });
    describe('building fields', () => {
        it('creates a localized text field', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .withTextValue('jobs')
                .buildAllDataSets();
            expect(result[0].fields[1].name).toEqual('jobs');
            expect(result[0].fields[1].type).toEqual('string');
            expect(result[0].fields[1].localized).toEqual(true);
        });
        it('creates a numeric field', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .withNumericValue('temperature', 'centigrade')
                .buildAllDataSets();
            expect(result[0].fields[1].name).toEqual('temperature');
            expect(result[0].fields[1].type).toEqual('number');
        });
    });
});

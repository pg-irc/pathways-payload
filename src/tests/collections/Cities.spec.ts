import { CccDatasetBuilder } from '../../helpers/ccc_dataset_builder';
import {
    GroupField,
    RelationshipField,
    TextField,
    NumberField,
} from 'payload/types';

export const buildCityComparableData = (): any =>
    new CccDatasetBuilder()
        .addDataSet('climate')
        .withNumericField('summer-low', 'centigrade')
        .withNumericField('summer-high', 'centigrade')
        .withNumericField('winter-low', 'centigrade')
        .withNumericField('winter-high', 'centigrade')
        .addDataSet('people')
        .withNumericField('population', 'persons')
        .withNumericField('percent-english-speakers', 'percent')
        .buildAllDataSets();

describe('CCC data set builder', () => {
    describe('building a data set', () => {
        let result: GroupField[] = undefined;
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
            const firstField = result[0].fields[0] as RelationshipField;
            expect(firstField.name).toEqual('meta-data');
        });
        it('sets the field type to "relationship"', () => {
            expect(result[0].fields[0].type).toEqual('relationship');
        });
        it('sets the field relation to', () => {
            const field = result[0].fields[0] as RelationshipField;
            expect(field.relationTo).toEqual('group-meta-data');
        });
        it('sets the field hasMany to false', () => {
            const field = result[0].fields[0] as RelationshipField;
            expect(field.hasMany).toEqual(false);
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
                .withTextField('jobs')
                .buildAllDataSets();
            const secondField = result[0].fields[1] as TextField;
            expect(secondField.name).toEqual('jobs');
            expect(result[0].fields[1].type).toEqual('text');
            expect(secondField.localized).toEqual(true);
        });
        it('creates a numeric field', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .withNumericField('temperature')
                .buildAllDataSets();
            const secondField = result[0].fields[1] as NumberField;
            expect(secondField.name).toEqual('temperature');
            expect(secondField.type).toEqual('number');
        });
    });
    describe ('building meta data', () => {
        it('creates metadata record with name', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .withNumericField('Summer low', 'centigrade')
                .buildMetaData();
            expect(result[0].name).toEqual('climate');
        });
        it ('creates metadata field with name', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .withNumericField('one')
                .withTextField('two')
                .buildMetaData();
            console.log(JSON.stringify(result));
            expect(result[0]['field-meta-data'][0].name).toEqual('one');
            expect(result[0]['field-meta-data'][1].name).toEqual('two');
        });
        it ('created metadata field with unit if given', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .withNumericField('no unit')
                .withNumericField('temperature', 'centigrade')
                .buildMetaData(); 

            expect(result[0]['field-meta-data'][0].name).toBe('no unit');
            expect(result[0]['field-meta-data'][0].unit).toBe(undefined);

            expect(result[0]['field-meta-data'][1].name).toBe('temperature');
            expect(result[0]['field-meta-data'][1].unit).toBe('centigrade');
        });
    });
});

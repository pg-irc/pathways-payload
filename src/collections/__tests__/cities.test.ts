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
        .addNumericField('summer-low', 'centigrade')
        .addNumericField('summer-high', 'centigrade')
        .addNumericField('winter-low', 'centigrade')
        .addNumericField('winter-high', 'centigrade')
        .addDataSet('people')
        .addNumericField('population', 'persons')
        .addNumericField('percent-english-speakers', 'percent')
        .buildCityDataFields();

describe('CCC data set builder', () => {
    describe('building a data set', () => {
        let result: GroupField[] = undefined;
        beforeEach(() => {
            result = new CccDatasetBuilder()
                .addDataSet('climate')
                .buildCityDataFields();
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
            expect(field.relationTo).toEqual('city-meta-data');
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
                .buildCityDataFields();
            expect(result[0].name).toEqual('foo');
            expect(result[1].name).toEqual('bar');
        });
    });
    describe('building fields', () => {
        it('creates a localized text field', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .addTextField('jobs')
                .buildCityDataFields();
            const secondField = result[0].fields[1] as TextField;
            expect(secondField.name).toEqual('jobs');
            expect(result[0].fields[1].type).toEqual('text');
            expect(secondField.localized).toEqual(true);
        });
        it('creates a numeric field', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .addNumericField('temperature')
                .buildCityDataFields();
            const secondField = result[0].fields[1] as NumberField;
            expect(secondField.name).toEqual('temperature');
            expect(secondField.type).toEqual('number');
        });
    });
    describe ('building meta data', () => {
        it('creates metadata record with name', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .addNumericField('Summer low', 'centigrade')
                .buildMetaData();
            expect(result[0]._id).toEqual('climate');
        });
        it ('creates metadata field with name', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .addNumericField('one')
                .addTextField('two')
                .buildMetaData();
            console.log(JSON.stringify(result));
            expect(result[0].cityMetaData[0].fieldName).toEqual('one');
            expect(result[0].cityMetaData[1].fieldName).toEqual('two');
        });
        it ('created metadata field with unit if given', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .addNumericField('no unit')
                .addNumericField('temperature', 'centigrade')
                .buildMetaData(); 

            expect(result[0].cityMetaData[0].fieldName).toBe('no unit');
            expect(result[0].cityMetaData[0].unit).toBe(undefined);

            expect(result[0].cityMetaData[1].fieldName).toBe('temperature');
            expect(result[0].cityMetaData[1].unit).toBe('centigrade');
        });
    });
});

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
                .withTextValue('jobs')
                .buildAllDataSets();
            const secondField = result[0].fields[1] as TextField;
            expect(secondField.name).toEqual('jobs');
            expect(result[0].fields[1].type).toEqual('text');
            expect(secondField.localized).toEqual(true);
        });
        it('creates a numeric field', () => {
            const result = new CccDatasetBuilder()
                .addDataSet('climate')
                .withNumericValue('temperature', 'centigrade')
                .buildAllDataSets();
            const secondField = result[0].fields[1] as NumberField;
            expect(secondField.name).toEqual('temperature');
            expect(secondField.type).toEqual('number');
        });
    });
});

import { CccDatasetBuilder } from "../helpers/ccc_dataset_builder";

const builder = new CccDatasetBuilder()
    .addDataSet('Climate')
    .withNumericField('Average days of rain per year')
    .withNumericField('Summer high', 'centigrade')
    .withNumericField('Summer low', 'centigrade')
    .withNumericField('Winter high', 'centigrade')
    .withNumericField('Winter low', 'centigrade')
    .addDataSet('People')
    .withNumericField('City population')
    .withNumericField('Province population')
    .withNumericField('English speakers', 'percent')
    .withNumericField('French speakers', 'percent')
    .withNumericField('Other speakers', 'percent')
    .addDataSet('Getting around')
    .withNumericField('Transit score®')
    .withNumericField('Walk score®')
    .addDataSet('Housing')
    .withNumericField('One bedroom rent average', 'dollars')
    .withNumericField('Apartment vacancy rate', 'percent')
    .withNumericField('Two bedroom rent average', 'dollars')
    .addDataSet('Health info for Ukrainians')
    .withTextField('Health card')
    .withTextField('Health and medications');

export const allTheFields = builder.buildAllDataSets();

export const allTheMetaData = builder.buildMetaData();

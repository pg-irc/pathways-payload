import { CccDatasetBuilder } from "../helpers/ccc_dataset_builder";

const builder = new CccDatasetBuilder()
    .addDataSet('Climate')
    .addNumericField('Average days of rain per year')
    .addNumericField('Summer high', 'centigrade')
    .addNumericField('Summer low', 'centigrade')
    .addNumericField('Winter high', 'centigrade')
    .addNumericField('Winter low', 'centigrade')
    .addDataSet('People')
    .addNumericField('City population')
    .addNumericField('Province population')
    .addNumericField('English speakers', 'percent')
    .addNumericField('French speakers', 'percent')
    .addNumericField('Other speakers', 'percent')
    .addDataSet('Getting around')
    .addNumericField('Transit score®')
    .addNumericField('Walk score®')
    .addDataSet('Housing')
    .addNumericField('One bedroom rent average', 'dollars')
    .addNumericField('Apartment vacancy rate', 'percent')
    .addNumericField('Two bedroom rent average', 'dollars')
    .addDataSet('Childcare')
    .addNumericField('Average cost 3 to 5 years', 'dollars')
    .addNumericField('Average cost 0 to 3 years', 'dollars')
    .addDataSet('Income support for Ukrainians')
    .addTextField('Income support')
    .addDataSet('Health info for Ukrainians')
    .addTextField('Health card')
    .addTextField('Health and medications')
    .addDataSet('Immigration pathways')
    .addTextField('Immigration pathways')
    //.addDataSet('Jobs')
    .addDataSet('Driving for Ukrainians')
    .addTextField('Driving information');

export const cityDataFields = builder.buildCityDataFields();

export const allTheMetaData = builder.buildMetaData();

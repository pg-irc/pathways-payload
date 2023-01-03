import { CollectionConfig, FieldHook, Field } from 'payload/types';
import { CccDatasetBuilder } from '../helpers/ccc_dataset_builder';

const allTheFields = new CccDatasetBuilder()
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
    .withTextField('Health and medications')
    .buildAllDataSets();

const Cities: CollectionConfig = {
    slug: 'cities',
    admin: {
        defaultColumns: ['name', 'updatedAt'],
        useAsTitle: 'name',
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            localized: true,
        },
        {
            name: 'province',
            type: 'relationship',
            relationTo: 'provinces',
            hasMany: false,
            label: 'Province',
            required: true,
        },
        {
            name: 'comparable-data',
            type: 'group',
            fields: allTheFields,
        },
    ],
};

export default Cities;

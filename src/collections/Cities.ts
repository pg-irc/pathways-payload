import { CollectionConfig, FieldHook, Field } from 'payload/types';
import { CccDatasetBuilder } from '../helpers/ccc_dataset_builder';
import { valueIsValueWithRelation } from 'payload/dist/fields/config/types';

const setMetaDataReference = (metaDataId) => {
  const hook: FieldHook = async ({ value, data }) => metaDataId;
  return hook;
};

const allTheFields = new CccDatasetBuilder()
    .addDataSet('climate')
    .withNumericValue('Average days of rain per year')
    .withNumericValue('Summer high', 'centigrade')
    .withNumericValue('Summer low', 'centigrade')
    .withNumericValue('Winter high', 'centigrade')
    .withNumericValue('Winter low', 'centigrade')
    .addDataSet('People')
    .withNumericValue('City population')
    .withNumericValue('Province population')
    .withNumericValue('English speakers', 'percent')
    .withNumericValue('French speakers', 'percent')
    .withNumericValue('Other speakers', 'percent')
    .addDataSet('Getting around')
    .withNumericValue('Transit score®')
    .withNumericValue('Walk score®')
    .addDataSet('Housing')
    .withNumericValue('One bedroom rent average', 'dollars')
    .withNumericValue('Apartment vacancy rate', 'percent')
    .withNumericValue('Two bedroom rent average', 'dollars')
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

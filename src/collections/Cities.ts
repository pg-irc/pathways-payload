import { CollectionConfig, FieldHook, Field } from 'payload/types';
import { CccDatasetBuilder } from '../helpers/ccc_dataset_builder';

const setMetaDataReference = (metaDataId) => {
  const hook: FieldHook = async ({ value, data }) => metaDataId;
  return hook;
};

const allTheFields = new CccDatasetBuilder()
    .addDataSet('climate')
    .withNumericValue('summer-high', 'centigrade')
    .withNumericValue('summer-low', 'centigrade')
    .withNumericValue('winter-high', 'centigrade')
    .withNumericValue('winter-high', 'centigrade')
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

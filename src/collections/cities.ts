import { CollectionConfig, FieldHook, Field } from 'payload/types';
import { allTheFields as cccFields } from '../data/ccc_fields';

const Cities: CollectionConfig = {
    slug: 'cities',
    admin: {
        defaultColumns: ['cityName'],
        useAsTitle: 'cityName',
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: 'cityName',
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
            fields: cccFields,
        },
    ],
};

export default Cities;

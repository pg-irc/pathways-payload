import { CollectionConfig, FieldHook, Field } from 'payload/types';
import { allTheFields } from './ccc_fields';

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

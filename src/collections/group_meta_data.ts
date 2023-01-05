import { CollectionConfig } from 'payload/types';

const GroupMetaData: CollectionConfig = {
    slug: 'group-meta-data',
    admin: {
        defaultColumns: ['id', 'fields', 'description'],
        useAsTitle: 'id',
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        { name: 'id', type: 'text', unique: true, localized: false },
        { name: 'description', type: 'text', localized: true },
        {
            name: 'cityMetaData',
            type: 'array',
            fields: [
                { name: 'name', type: 'text', localized: false },
                { name: 'type', type: 'text' }, // can only be one of the strings 'number' or 'text'
                { name: 'description', type: 'text', localized: true },
                {
                    name: 'unit', // unit can only exist on 'number' fields
                    type: 'select',
                    options: [
                        'persons',
                        'percent',
                        'dollars',
                        'centigrade',
                        'localized text',
                    ],
                    required: false,
                    hasMany: false,
                    label: 'Unit of measurement',
                },
            ],
            admin: {
                components: {
                    RowLabel: ({ data, path, index }) =>
                        data?.name ||
                        `Field Meta Data ${String(index).padStart(2, '0')}`,
                },
            },
        },
    ],
};

export default GroupMetaData;

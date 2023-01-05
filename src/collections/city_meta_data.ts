import { CollectionConfig } from 'payload/types';

const CityMetaData: CollectionConfig = {
    slug: 'city-meta-data',
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
            name: 'cityMetaData',// TODO rename to cityFields
            type: 'array',
            fields: [
                { name: 'name', type: 'text', localized: false }, // TODO rename to fieldName
                { name: 'type', type: 'text', localized: false }, // can only be one of the strings 'number' or 'text', TODO rename to fieldType
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
                        `City meta data ${String(index).padStart(2, '0')}`,
                },
            },
        },
    ],
};

export default CityMetaData;

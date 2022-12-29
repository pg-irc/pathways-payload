import { CollectionConfig } from 'payload/types';

const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        defaultColumns: ['name'],
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
            unique: true,
        },
    ],
    timestamps: false,
};

export default Tags;

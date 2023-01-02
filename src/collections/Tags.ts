import { CollectionConfig } from 'payload/types';

const Tags: CollectionConfig = {
    slug: 'tags',
    admin: {
        defaultColumns: ['id'],
        useAsTitle: 'id',
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [{ name: 'id', type: 'text', unique: true }],
    timestamps: false,
};

export default Tags;

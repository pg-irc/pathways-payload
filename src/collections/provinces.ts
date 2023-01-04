import { CollectionConfig } from 'payload/types';

const Provinces: CollectionConfig = {
    slug: 'provinces',
    admin: {
        defaultColumns: ['id', 'provinceName'],
        useAsTitle: 'id',
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        { name: 'id', type: 'text', label: 'Abbreviated name', unique: true },
        { name: 'provinceName', type: 'text', localized: true },
    ],
    timestamps: false,
};

export default Provinces;

import { CollectionConfig } from 'payload/types';

const Chapters: CollectionConfig = {
    slug: 'chapters',
    admin: {
        defaultColumns: ['chapterName', 'displayOrder'],
        useAsTitle: 'chapterName',
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        { name: 'chapterName', type: 'text', localized: true },
        { name: 'displayOrder', type: 'number' },
    ],
    timestamps: false,
};

export default Chapters;

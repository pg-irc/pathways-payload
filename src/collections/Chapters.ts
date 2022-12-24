import { CollectionConfig } from 'payload/types';

const Chapters: CollectionConfig = {
  slug: 'chapters',
  admin: {
    defaultColumns: ['name', 'displayOrder'],
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
      name: 'displayOrder',
      type: 'number'
    }
  ],
  timestamps: false,
}

export default Chapters;

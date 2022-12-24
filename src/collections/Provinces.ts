import { CollectionConfig } from 'payload/types';

const Provinces: CollectionConfig = {
  slug: 'provinces',
  admin: {
    defaultColumns: ['name', 'shortName', 'updatedAt'],
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
      unique: true,
    },
    {
      name: 'shortName',
      type: 'text',
      label: 'Two letter province name',
      unique: true,
    }
  ],
}

export default Provinces;

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
    { name: 'id', type: 'text', label: 'Abbreviated name', unique: true, },
    { name: 'name', type: 'text', localized: true, },
  ],
}

export default Provinces;

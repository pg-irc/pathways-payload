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
  // TODO add id field to hold short name, and remove the short name
  fields: [
    {
      name: 'name',
      type: 'text',
      localized: true,
    },
    {
      name: 'shortName',
      type: 'text',
      label: 'Abbreviated name',
      unique: true,
    }
  ],
}

export default Provinces;

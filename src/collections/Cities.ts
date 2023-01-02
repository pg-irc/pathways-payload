import { CollectionConfig } from 'payload/types';

const Cities: CollectionConfig = {
  slug: 'cities',
  admin: {
    defaultColumns: ['name', 'updatedAt'],
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
  ],
}

export default Cities;

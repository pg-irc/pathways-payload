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
    {
      name: 'province',
      type: 'relationship',
      relationTo: 'provinces',
      hasMany: false,
      label: 'Province',
      required: true,
    },
    {
      name: 'comparable-data',
      type: 'group',
      fields: [
        {
          name: 'climate',
          type: 'group',
          fields: [
            {
              name: 'meta-data',
              type: 'relationship',
              relationTo: 'group-meta-data',
              hasMany: false,
              // hook will assign this to the "climate" group metadata document
            },
            { name: 'summer-high', type: 'number' },
            { name: 'summer-low', type: 'number' }
          ]
        },
        {
          name: 'people',
          type: 'group',
          fields: [
            {
              name: 'meta-data',
              type: 'relationship',
              relationTo: 'group-meta-data',
              hasMany: false,
              // hook will assign this to the "people" group metadata document
            },
            { name: 'population', type: 'number' },
            { name: 'english-speakers-percent', type: 'number' }
          ]
        }
      ]
    }
  ],
}

export default Cities;

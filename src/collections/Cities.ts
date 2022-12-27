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
      name: 'ccc-data',
      type: 'group',
      fields: [
        {
          name: 'climate',
          // add a link to a particlular hard-coded document for climate?
          type: 'group',
          fields: [
            {
              name: 'summer-high',
              type: 'number',
              // add a link to a particular hard-coded document for summer high?
            },
            {
              name: 'summer-low',
              type: 'number',
            }
          ]
        },
        {
          name: 'people',
          type: 'group',
          fields: [
            {
              name: 'population',
              type: 'number',
            },
            {
              name: 'english-speakers-percent',
              type: 'number',
            }
          ]
        }
      ]
    }
  ],
}

export default Cities;

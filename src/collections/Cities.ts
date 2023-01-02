import { CollectionConfig, FieldHook } from 'payload/types';

const setMetaDataReference = (metaDataId) => {
  const hook: FieldHook = async ({ value, data }) => metaDataId;
  return hook;
};

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
                            hooks: {
                                beforeChange: [setMetaDataReference('climate')],
                            },
                            admin: { hidden: true },
                        },
                        { name: 'summer-high', type: 'number' },
                        { name: 'summer-low', type: 'number' },
                    ],
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
                            hooks: { beforeChange: [setMetaDataReference('people')] },
                            admin: { hidden: true },
                        },
                        { name: 'population', type: 'number' },
                        { name: 'english-speakers-percent', type: 'number' },
                    ],
                },
            ],
        },
    ],
};

export default Cities;

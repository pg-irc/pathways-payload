import { CollectionConfig } from 'payload/types';

const CccFilters: CollectionConfig = {
  slug: "ccc-filters",
  admin: {
    defaultColumns: ["name", "displayOrder", "updatedAt"],
    useAsTitle: "name",
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "name",
      type: "text",
      localized: true,
    },
    {
      name: "description",
      type: "text",
      localized: true,
    },
    {
      name: "icon",
      type: "text",
      label: "Icon: Enter a fontAwesome5 icon name",
    },
    {
      name: "displayOrder",
      type: "number",
    },
    {
      name: "fields",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          localized: true,
        },
        {
          name: 'unit',
          type: 'text',
        },
        {
          name: 'displayOrder',
          type: 'number',
        }
      ],
    },
  ],
};

export default CccFilters;

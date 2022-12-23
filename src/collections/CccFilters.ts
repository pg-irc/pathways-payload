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
      label: "Filter name",
    },
    {
      name: "description",
      type: "text",
      localized: true,
      label: "Filter description",
    },
    {
      name: "icon",
      type: "text",
      label: "Icon: Enter a fontAwesome5 icon name",
    },
    {
      name: "displayOrder",
      type: "number",
      label: "Filter display order",
    },
    {
      name: "fields",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
          localized: true,
          label: "Field name",
        },
        {
          name: "unit",
          type: "select",
          options: ["percent", "dollars", "centigrade"],
          required: false,
          hasMany: false,
          label: "Unit of measurement",
        },
        {
          name: "displayOrder",
          type: "number",
          label: "Field display order",
        },
      ],
    },
  ],
};

export default CccFilters;

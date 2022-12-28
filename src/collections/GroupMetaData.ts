import { CollectionConfig } from 'payload/types';

const GroupMetaData: CollectionConfig = {
  slug: "group-meta-data",
  admin: {
    defaultColumns: ["name", "values", "description"],
    useAsTitle: "name",
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    { name: "name", type: "text", unique: true },
    { name: "description", type: "text", localized: true },
    {
      name: "values",
      type: "array",
      fields: [
        { name: "name", type: "text" },
        { name: "description", type: "text" },
        { name: "unit", type: "text" }, // TODO make this a select
      ],
    },
  ],
  timestamps: false,
};

export default GroupMetaData;

import { CollectionConfig } from 'payload/types';

const Tags: CollectionConfig = {
  slug: "tags",
  admin: {
    defaultColumns: ["name", "updatedAt"],
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
    },
  ],
  timestamps: false,
};

export default Tags;

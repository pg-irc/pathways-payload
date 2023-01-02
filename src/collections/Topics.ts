import { CollectionConfig } from 'payload/types';

const Topics: CollectionConfig = {
  slug: "topics",
  admin: {
    defaultColumns: ["name", "tags", "provinces", "displayOrder"],
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
      name: "tags",
      type: "relationship",
      relationTo: "tags",
      hasMany: true,
    },
    {
      name: "content",
      type: "text",
      localized: true,
    },
    {
      name: "chapters",
      type: "relationship",
      relationTo: "chapters",
      hasMany: true,
      label: 'The topic is part of these chapters',
    },
    {
      name: "provinces",
      type: "relationship",
      relationTo: "provinces",
      hasMany: true,
      label: 'The topic is relevant in these provinces',
    },
    {
      name: "displayOrder",
      type: "number",
    },
  ],
  timestamps: false,
};

export default Topics;

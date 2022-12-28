import { CollectionConfig } from 'payload/types';

const GroupMetaData: CollectionConfig = {
  slug: "group-meta-data",
  admin: {
    defaultColumns: ["name"],
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
      unique: true,
    },
    {
      name: 'description',
      type: 'text',
      localized: true
    }
  ],
  timestamps: false,
};

export default GroupMetaData;

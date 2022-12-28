import { CollectionConfig, FieldHook } from 'payload/types';

const setMetadataReference: FieldHook = async ({ value, data }) => {
  // TODO look up the correct metadata document id
  console.log(JSON.stringify(data));
  return "63ac73a26115f74796575e5e"; // people id
}

const Cities: CollectionConfig = {
  slug: "cities",
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
      localized: true,
    },
    {
      name: "province",
      type: "relationship",
      relationTo: "provinces",
      hasMany: false,
      label: "Province",
      required: true,
    },
    {
      name: "comparable-data",
      type: "group",
      fields: [
        {
          name: "climate",
          type: "group",
          fields: [
            {
              name: "meta-data",
              type: "relationship",
              relationTo: "group-meta-data",
              hasMany: false,
              hooks: { beforeChange: [setMetadataReference] },
            },
            { name: "summer-high", type: "number" },
            { name: "summer-low", type: "number" },
          ],
        },
        {
          name: "people",
          type: "group",
          fields: [
            {
              name: "meta-data",
              type: "relationship",
              relationTo: "group-meta-data",
              hasMany: false,
              hooks: { beforeChange: [setMetadataReference] },
            },
            { name: "population", type: "number" },
            { name: "english-speakers-percent", type: "number" },
          ],
        },
      ],
    },
  ],
};

export default Cities;

import { CollectionConfig } from 'payload/types';

const Questions: CollectionConfig = {
  slug: "questions",
  admin: {
    defaultColumns: ["questionText", "displayOrder", "answers", "updatedAt"],
    useAsTitle: "questionText",
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: "questionText",
      type: "text",
      localized: true,
    },
    {
      name: "displayOrder",
      type: "number",
    },
    {
      name: "provinces",
      type: "relationship",
      relationTo: "provinces",
      hasMany: true,
      label:
        "The provinces this question is shown in, leave empty to show in all provinces",
      unique: false,
    },
    {
      name: "answers",
      type: "array",
      fields: [
        {
          name: "answerText",
          type: "text",
          localized: true,
        },
        {
          name: "displayOrder",
          type: "number",
        },
        {
          name: "provinces",
          type: "relationship",
          relationTo: "provinces",
          hasMany: true,
          label:
            "The provinces this answer is shown in, leave empty to show in all provinces",
          unique: false,
        },
      ],
    },
  ],
};

export default Questions;

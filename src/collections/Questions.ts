import { CollectionConfig } from "payload/types";

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
          name: "provinces",
          type: "relationship",
          relationTo: "provinces",
          hasMany: true,
          label:
            "The provinces this answer is shown in, leave empty to show in all provinces",
        },
        {
          name: "recommendTags",
          type: "relationship",
          relationTo: "tags",
          hasMany: true,
          label: "Recommend topics with these tags",
        },
      ],
      admin: {
        components: {
          RowLabel: ({ data, index }) =>
            data?.answerText || `Answer ${String(index).padStart(2, "0")}`,
        },
      },
    },
  ],
  endpoints: [
    {
      // access with http://localhost:3000/api/questions/BC/tracking
      path: "/:province/tracking",
      method: "get",
      handler: async (req, res, _next) => {
        const questions = await getQuestionsForProvince(req, req.params.province);
        if (questions) {
          res.status(200).send({ tracking: questions });
        } else {
          res.status(404).send({ error: "not found" });
        }
      },
    },
  ],
};

// return questions where provinces is either empty, or contain the given province
//
// Mongo queries
//
// { provinces: []}
// { provinces: '63a9d4bd4977177c6ba65405'}
// { $or: [{provinces: []}, { provinces: '63a9d4bd4977177c6ba65405'}]}
//
// Payload queries
//
// 

const getQuestionsForProvince = async (req, id) => { 
  const cms = req.payload;
  const found = await cms.find({
    collection: "questions",
    where: {
      provinces: {
        equals: []
      }
    },
  });
  return found;
};

export default Questions;

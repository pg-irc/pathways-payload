import { CollectionConfig } from 'payload/types';
import { handleQuestionRequest } from '../api/questions';

const Questions: CollectionConfig = {
    slug: 'questions',
    admin: {
        defaultColumns: [
            'questionText',
            'displayOrder',
            'answers',
        ],
        useAsTitle: 'questionText',
    },
    access: {
        create: () => true,
        read: () => true,
        update: () => true,
        delete: () => true,
    },
    fields: [
        {
            name: 'questionText',
            type: 'text',
            localized: true,
        },
        {
            name: 'displayOrder',
            type: 'number',
        },
        {
            name: 'provinces',
            type: 'relationship',
            relationTo: 'provinces',
            hasMany: true,
            label: 'The provinces this question is shown in, leave empty to show in all provinces',
        },
        {
            name: 'answers',
            type: 'array',
            fields: [
                {
                    name: 'answerText',
                    type: 'text',
                    localized: true,
                },
                {
                    name: 'provinces',
                    type: 'relationship',
                    relationTo: 'provinces',
                    hasMany: true,
                    label: 'The provinces this answer is shown in, leave empty to show in all provinces',
                },
                {
                    name: 'recommendTags',
                    type: 'relationship',
                    relationTo: 'tags',
                    hasMany: true,
                    label: 'Recommend topics with these tags',
                },
            ],
            admin: {
                components: {
                    RowLabel: ({ data, path, index }) =>
                        data?.answerText ||
                        `Answer ${String(index).padStart(2, '0')}`,
                },
            },
        },
    ],
    endpoints: [
        {
            // access with http://localhost:3000/api/questions/for-province/63a9d4d84977177c6ba6541e
            path: '/for-province/:province',
            method: 'get',
            handler: handleQuestionRequest,
        },
    ],
};

export default Questions;

import { buildConfig } from 'payload/config';
import path from 'path';
import Questions from './collections/xQuestions';
import Users from './collections/xUsers';
import Provinces from './collections/xProvinces';
import Cities from './collections/xCities';
import Tags from './collections/xTags';
import Chapters from './collections/xChapters';
import Topics from './collections/xTopics';
import GroupMetaData from './collections/xGroupMetaData';

export default buildConfig({
    serverURL: 'http://localhost:3000',
    admin: {
        user: Users.slug,
    },
    collections: [
        Questions,
        Provinces,
        Cities,
        GroupMetaData,
        Chapters,
        Topics,
        Tags,
        Users,
    ],
    localization: {
        locales: ['en', 'es', 'de'],
        defaultLocale: 'en',
        fallback: true,
    },
    typescript: {
        outputFile: path.resolve(__dirname, 'payload-types.ts'),
    },
    graphQL: {
        schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
    },
});

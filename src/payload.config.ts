import { buildConfig } from 'payload/config';
import path from 'path';
import Questions from './collections/questions';
import Users from './collections/users';
import Provinces from './collections/provinces';
import Cities from './collections/cities';
import Tags from './collections/tags';
import Chapters from './collections/chapters';
import Topics from './collections/topics';
import GroupMetaData from './collections/group_meta_data';

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

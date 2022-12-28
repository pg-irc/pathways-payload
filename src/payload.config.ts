import { buildConfig } from 'payload/config';
import path from 'path';
import Questions from './collections/Questions';
import Users from './collections/Users';
import Provinces from './collections/Provinces';
import Cities from './collections/Cities';
import Tags from './collections/Tags';
import Chapters from './collections/Chapters';
import Topics from './collections/Topics';
import GroupMetaData from './collections/GroupMetaData';

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  collections: [Questions, Provinces, Cities, GroupMetaData, Chapters, Topics, Tags, Users],
  localization: {
    locales: ["en", "es", "de"],
    defaultLocale: "en",
    fallback: true,
  },
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, "generated-schema.graphql"),
  },
});

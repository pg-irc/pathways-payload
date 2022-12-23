import { buildConfig } from 'payload/config';
import path from 'path';
import Questions from './collections/Questions';
import Users from './collections/Users';
import Provinces from './collections/Provinces';
import Cities from './collections/Cities';

export default buildConfig({
  serverURL: "http://localhost:3000",
  admin: {
    user: Users.slug,
  },
  collections: [Questions, Provinces, Cities, Users],
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

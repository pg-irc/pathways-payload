import { buildConfig } from 'payload/config';
import path from 'path';
import Questions from './collections/Questions';
import Users from './collections/Users';
import Provinces from './collections/Provinces';

export default buildConfig({
  serverURL: 'http://localhost:3000',
  admin: {
    user: Users.slug,
  },
  collections: [
    Questions,
    Provinces,
    Users,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts')
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
});

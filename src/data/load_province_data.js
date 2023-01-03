const payload = require('payload');
const path = require('path');

const provinces = require('./provinces.json');

require('dotenv').config();

const { PAYLOAD_SECRET, MONGODB_URI } = process.env;

payload.init({
    secret: PAYLOAD_SECRET,
    mongoURL: MONGODB_URI,
    local: true,
});

const createHomePage = async () => {
  const createdMedia = await payload.create({
      collection: 'provinces',
      data: {
          _id: 'PIE',
          name: 'Prince Edward',
      },
  });

  console.log('Seed completed!');
  process.exit(0);
};

createHomePage();


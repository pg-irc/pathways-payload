#!/usr/local/bin/node
const payload = require('payload');
const provinces = require('./provinces.json');
require('dotenv').config();
const { allTheMetaData } = require('../../dist/data/ccc_fields.js');

const { PAYLOAD_SECRET, MONGODB_URI } = process.env;

payload.init({
    secret: PAYLOAD_SECRET,
    mongoURL: MONGODB_URI,
    local: true,
});

const createSystemData = async () => {
    for (let i = 0; i < provinces.length; i++) {
        await payload.create({
            collection: 'provinces',
            data: provinces[i],
        });
    }
    
    for (let i = 0; i < allTheMetaData.length; i++) {
        await payload.create({
            collection: 'group-meta-data',
            data: allTheMetaData[i],
        });
    }

    console.log('Seed completed!');
    process.exit(0);
};

createSystemData();

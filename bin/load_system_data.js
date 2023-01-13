#!/usr/local/bin/node
const payload = require('payload');
const provinces = require('../src/data/provinces.json');
require('dotenv').config();
const { allTheMetaData } = require('../dist/data/ccc_fields.js');

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
            collection: 'city-meta-data',
            data: allTheMetaData[i],
        });
    }
    await payload.update({
        collection: 'provinces',
        locale: 'de',
        id: 'BC',
        data: { provinceName: 'Britisch-Kolumbien' },
    });
    await payload.update({
        collection: 'provinces',
        locale: 'es',
        id: 'BC',
        data: { provinceName: 'Columbia Británica' },
    });
    await payload.create({
        collection: 'questions',
        data: {
            id: 'q1',
            questionText: 'The question in English',
            answers: [
                { id: 'a1', answerText: 'First answer in English' },
                { id: 'a2', answerText: 'Second answer in English' },
                { id: 'a3', answerText: 'Third answer in English' },
            ],
        },
    });
    await payload.update({
        collection: 'questions',
        locale: 'de',
        id: 'q1',
        data: {
            questionText: 'The question in German',
            answers: [
                { id: 'a1', answerText: 'First answer in German' },
                { id: 'a2', answerText: 'Second answer in German' },
                { id: 'a3', answerText: 'Third answer in German' },
            ],
        },
    });

    console.log('Seed completed!');
    process.exit(0);
};

createSystemData();

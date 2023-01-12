
const findLocalizedFields = (configuration) => {
    return [];
}

describe('extract POT data', () => {
    describe('find localized fields', () => {
        it('returns nothing for a collection with no localized fields', () => {
            const configuration = {
                slug: 'foo',
                fields: [
                    {
                        name: 'bar',
                        type: 'number',
                    },
                ],
            };
            const fields = findLocalizedFields(configuration);
            expect(fields).toEqual([]);
        });
    });
});

import { FieldHook } from 'payload/types';

const setMetaDataReference = (metaDataId: string): FieldHook => {
  return async () => metaDataId;
};

interface Field {
    name: string;
    type: string;
    relationTo?: string;
    hasMany?: boolean;
    hooks?: any;
    admin?: any;
    localized?: boolean;
}

interface Group {
    name: string;
    type: 'group';
    fields: Field[];
}

class FooDataBuilder {
    data: Group[];
    constructor() {        
        this.data = [];
    }
    withGroup(name): FooDataBuilder {
        this.data = [
            ...this.data,
            {
                name,
                type: 'group',
                fields: [
                    {
                        name: 'meta-data',
                        type: 'relationship',
                        relationTo: 'group-meta-data',
                        hasMany: false,
                        hooks: { beforeChange: [setMetaDataReference(name)] },
                        admin: { hidden: true },
                    },
                ],
            },
        ];
        return this;
    }
    withTextField(name: string): FooDataBuilder {
        const last = this.data[this.data.length - 1];
        this.data[this.data.length - 1] = {
            ...last,
            fields: [
                ...last.fields,
                { name, type: 'string', localized: true },
            ],
        };
        return this;
    }
    withNumericField(name: string, _unit: string): FooDataBuilder {
        const last = this.data[this.data.length - 1];
        this.data[this.data.length - 1] = {
            ...last,
            fields: [...last.fields, { name, type: 'number' }],
        };
        return this;
    }
    buildFields(): Object {
        return this.data;
    }
};

describe('Comparable data builder', () => {
    describe('building a group', () => {
        let result: object = undefined;
        beforeEach(() => { 
            result = new FooDataBuilder().withGroup('climate').buildFields();
        })
        it('creates a group with the given name', () => {
            expect(result[0].name).toEqual('climate');
            expect(result[0].type).toEqual('group');
        });
        it ('creates field for relationship to meta data', () => {
            expect(result[0].fields[0].name).toEqual('meta-data'); 
            expect(result[0].fields[0].type).toEqual('relationship'); 
            expect(result[0].fields[0].relationTo).toEqual('group-meta-data'); 
            expect(result[0].fields[0].hasMany).toEqual(false); 
            expect(result[0].fields[0].admin).toEqual({hidden: true}); 
        });
        it ('can create two groups', () => {
            const result = new FooDataBuilder().withGroup('foo').withGroup('bar').buildFields();
            expect(result[0].name).toEqual('foo');
            expect(result[1].name).toEqual('bar');
        });
    });
    describe ('building fields', () => {
        it('creates a localized text field', () => {
            const result = new FooDataBuilder()
                .withGroup('climate')
                .withTextField('jobs')
                .buildFields();
            expect(result[0].fields[1].name).toEqual('jobs');
            expect(result[0].fields[1].type).toEqual('string');
            expect(result[0].fields[1].localized).toEqual(true);
        });
        it('creates a numeric field', () => {
            const result = new FooDataBuilder()
                .withGroup('climate')
                .withNumericField('temperature', 'centigrade')
                .buildFields();
            expect(result[0].fields[1].name).toEqual('temperature');
            expect(result[0].fields[1].type).toEqual('number');
        });
    });
});

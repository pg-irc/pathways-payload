import { FieldHook, GroupField } from 'payload/types';

const setMetaDataReference = (metaDataId: string): FieldHook => {
    const hook: FieldHook = async ({ value, data }) => metaDataId;
    return hook;
};

export class CccDatasetBuilder {
    groupFields: GroupField[];

    constructor() {
        this.groupFields = [];
    }

    addDataSet(name: string): CccDatasetBuilder {
        const newGroup: GroupField = {
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
        };
        this.groupFields = [...this.groupFields, newGroup];
        return this;
    }

    withTextValue(name: string): CccDatasetBuilder {
        const lastGroup = this.groupFields[this.groupFields.length - 1];
        this.groupFields[this.groupFields.length - 1] = {
            ...lastGroup,
            fields: [
                ...lastGroup.fields,
                { name, type: 'text', localized: true },
            ],
        };
        return this;
    }

    withNumericValue(name: string, _unit: string): CccDatasetBuilder {
        const lastGroup = this.groupFields[this.groupFields.length - 1];
        this.groupFields[this.groupFields.length - 1] = {
            ...lastGroup,
            fields: [...lastGroup.fields, { name, type: 'number' }],
        };
        return this;
    }

    buildAllDataSets(): GroupField[] {
        return this.groupFields;
    }
}


import { FieldHook } from 'payload/types';

const setMetaDataReference = (metaDataId: string): FieldHook => {
    const hook: FieldHook = async ({ value, data }) => metaDataId;
    return hook;
};

export interface CccValue {
    name: string;
    type: string;
    relationTo?: string;
    hasMany?: boolean;
    hooks?: any;
    admin?: any;
    localized?: boolean;
}

export interface CccDataSet {
    name: string;
    type: 'group';
    fields: CccValue[];
}

export class CccDatasetBuilder {
    dataSets: CccDataSet[];
    constructor() {
        this.dataSets = [];
    }
    addDataSet(name: string): CccDatasetBuilder {
        this.dataSets = [
            ...this.dataSets,
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
    withTextValue(name: string): CccDatasetBuilder {
        const lastDataSet = this.dataSets[this.dataSets.length - 1];
        this.dataSets[this.dataSets.length - 1] = {
            ...lastDataSet,
            fields: [
                ...lastDataSet.fields,
                { name, type: 'string', localized: true },
            ],
        };
        return this;
    }
    withNumericValue(name: string, _unit: string): CccDatasetBuilder {
        const lastDataSet = this.dataSets[this.dataSets.length - 1];
        this.dataSets[this.dataSets.length - 1] = {
            ...lastDataSet,
            fields: [...lastDataSet.fields, { name, type: 'number' }],
        };
        return this;
    }
    buildAllDataSets(): CccDataSet[] {
        return this.dataSets;
    }
}


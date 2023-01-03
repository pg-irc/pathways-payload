import { FieldHook, GroupField } from 'payload/types';

export interface FieldMetaData {
    name: string;
}

export interface MetaData {
    name: string;
    'field-meta-data': FieldMetaData[];
 };

export class CccDatasetBuilder {
    groupFields: GroupField[];
    metaData: MetaData[];

    constructor() {
        this.groupFields = [];
        this.metaData = [];
    }

    getLastGroup(): GroupField {
        return this.groupFields[this.groupFields.length - 1];
    }

    setLastGroup(group: GroupField): void {
        this.groupFields[this.groupFields.length - 1] = group;
    }

    appendGroup(group: GroupField): void {
        this.groupFields = [...this.groupFields, group];
    }

    addDataSet(name: string): CccDatasetBuilder {
        const setMetaDataReference = (name: string): FieldHook => {
            const hook: FieldHook = async ({ value, data }) => name;
            return hook;
        };

        this.appendGroup({
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
        });
        
        this.metaData = [...this.metaData, { name, 'field-meta-data': [] }];

        return this;
    }

    withTextField(name: string): CccDatasetBuilder {
        const lastGroup = this.getLastGroup();
        this.setLastGroup({
            ...lastGroup,
            fields: [
                ...lastGroup.fields,
                { name, type: 'text', localized: true },
            ],
        });
       
        const lastMetaData = this.metaData[this.metaData.length - 1];
        this.metaData[this.metaData.length - 1] = {
            ...lastMetaData,
            'field-meta-data': [...lastMetaData['field-meta-data'], { name }],
        };

        return this;
    }

    withNumericField(
        name: string,
        _unit?: 'percent' | 'centigrade' | 'dollars' | 'persons'
    ): CccDatasetBuilder {
        const lastGroup = this.getLastGroup();
        this.setLastGroup({
            ...lastGroup,
            fields: [...lastGroup.fields, { name, type: 'number' }],
        });

        const lastMetaData = this.metaData[this.metaData.length - 1];
        this.metaData[this.metaData.length - 1] = {
            ...lastMetaData,
            'field-meta-data': [...lastMetaData['field-meta-data'], { name }],
        };

        return this;
    }

    buildAllDataSets(): GroupField[] {
        return this.groupFields;
    }
    
    buildMetaData(): MetaData[] {
        return this.metaData;
    }
}

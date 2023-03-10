import { FieldHook, GroupField } from 'payload/types';

type Unit = 'percent' | 'centigrade' | 'dollars' | 'persons';

export interface FieldMetaData {
    name: string;
    description?: string;
    type: 'text' | 'number';
    unit?: Unit; // unit only applies when type is number
}

export interface DataSetMetaData {
    _id: string;
    description?: string;
    'field-meta-data': FieldMetaData[];
}

export class CccDatasetBuilder {
    groupFields: GroupField[];
    metaData: DataSetMetaData[];

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

        this.metaData = [
            ...this.metaData,
            {
                _id: name,
                description: 'dummy description',
                'field-meta-data': [],
            },
        ];

        return this;
    }

    addTextField(name: string): CccDatasetBuilder {
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
            'field-meta-data': [
                ...lastMetaData['field-meta-data'],
                { name, description: 'dummy description 2', type: 'text' },
            ],
        };

        return this;
    }

    addNumericField(name: string, unit?: Unit): CccDatasetBuilder {
        const lastGroup = this.getLastGroup();
        this.setLastGroup({
            ...lastGroup,
            fields: [...lastGroup.fields, { name, type: 'number' }],
        });

        const lastMetaData = this.metaData[this.metaData.length - 1];
        this.metaData[this.metaData.length - 1] = {
            ...lastMetaData,
            'field-meta-data': [
                ...lastMetaData['field-meta-data'],
                { name, description: 'dummy description 1', unit, type: 'number' },
            ],
        };

        return this;
    }

    buildAllDataSets(): GroupField[] {
        return this.groupFields;
    }

    buildMetaData(): DataSetMetaData[] {
        return this.metaData;
    }
}

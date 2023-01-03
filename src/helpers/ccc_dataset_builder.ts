import { FieldHook, GroupField } from 'payload/types';

export class CccDatasetBuilder {
    groupFields: GroupField[];

    constructor() {
        this.groupFields = [];
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
        return this;
    }

    buildAllDataSets(): GroupField[] {
        return this.groupFields;
    }
}


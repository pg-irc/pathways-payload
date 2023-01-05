import { FieldHook, GroupField } from 'payload/types';

type Unit = 'percent' | 'centigrade' | 'dollars' | 'persons';

export interface CityMetaDatum {
    name: string;
    description?: string;
    type: 'text' | 'number';
    unit?: Unit; // unit only applies when type is number
}

export interface CityMetaDataSet {
    _id: string;
    description?: string;
    'field-meta-data': CityMetaDatum[];
}

export class CccDatasetBuilder {
    cityDataSets: GroupField[];
    cityMetaDataSets: CityMetaDataSet[];

    constructor() {
        this.cityDataSets = [];
        this.cityMetaDataSets = [];
    }

    getLastCityDataSet(): GroupField {
        return this.cityDataSets[this.cityDataSets.length - 1];
    }

    setLastCityDataSet(set: GroupField): void {
        this.cityDataSets[this.cityDataSets.length - 1] = set;
    }

    appendCityDataSet(set: GroupField): void {
        this.cityDataSets = [...this.cityDataSets, set];
    }
    
    getLastCityMetaDataSet(): CityMetaDataSet {
        return this.cityMetaDataSets[this.cityMetaDataSets.length - 1];
    }
    
    setLastCityMetaDataSet(set: CityMetaDataSet): void {
        this.cityMetaDataSets[this.cityMetaDataSets.length - 1] = set;
    }
    
    appendCityMetaDataSet(set: CityMetaDataSet): void {
        this.cityMetaDataSets = [...this.cityMetaDataSets, set];
    }

    addDataSet(name: string): CccDatasetBuilder {
        const setMetaDataReference = (name: string): FieldHook => {
            const hook: FieldHook = async ({ value, data }) => name;
            return hook;
        };

        this.appendCityDataSet({
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
        
        this.appendCityMetaDataSet({
            _id: name,
            description: 'dummy description',
            'field-meta-data': [],
        }); 

        return this;
    }

    addTextField(name: string): CccDatasetBuilder {
        const lastDataSet = this.getLastCityDataSet();
        this.setLastCityDataSet({
            ...lastDataSet,
            fields: [
                ...lastDataSet.fields,
                { name, type: 'text', localized: true },
            ],
        });

        const lastMetaData = this.getLastCityMetaDataSet();
        this.setLastCityMetaDataSet({
            ...lastMetaData,
            'field-meta-data': [
                ...lastMetaData['field-meta-data'],
                { name, description: 'dummy description 2', type: 'text' },
            ],
        });

        return this;
    }

    addNumericField(name: string, unit?: Unit): CccDatasetBuilder {
        const lastDataSet = this.getLastCityDataSet();
        this.setLastCityDataSet({
            ...lastDataSet,
            fields: [...lastDataSet.fields, { name, type: 'number' }],
        });

        const lastMetaData = this.getLastCityMetaDataSet();
        this.setLastCityMetaDataSet({
            ...lastMetaData,
            'field-meta-data': [
                ...lastMetaData['field-meta-data'],
                {
                    name,
                    description: 'dummy description 1',
                    unit,
                    type: 'number',
                },
            ],
        });

        return this;
    }

    buildCityDataFields(): GroupField[] {
        return this.cityDataSets;
    }

    buildMetaData(): CityMetaDataSet[] {
        return this.cityMetaDataSets;
    }
}

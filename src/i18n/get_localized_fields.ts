import { CollectionConfig, Field, TextField } from 'payload/types';
import * as R from 'ramda';

export const getLocalizedFields = (configuration: CollectionConfig) =>
    getLocalizedFieldsRecursively([], configuration.fields);

const isLocalized = (field: Field): boolean =>
    field.type === 'text' && field.localized;

const isNested = (field: Field): boolean => R.has('fields', field);

interface NestedField {
    name: string;
    fields: Field[];
}

const getLocalizedFieldsRecursively = (
    path: string[],
    fields: Field[]
): string[][] => {
    const buildPathToLocalizedField = (accumulator: string[][], field: TextField) => [
        ...accumulator,
        [...path, field.name],
    ];

    const results = R.reduce(
        buildPathToLocalizedField,
        [],
        R.filter(isLocalized, fields)
    );

    const buildPathToNestedFields = (accumulator: string[][], field: NestedField) => {
        const p = [...path, field.name];
        const f = field.fields;
        return [...accumulator, ...getLocalizedFieldsRecursively(p, f)];
    };

    return R.reduce(
        buildPathToNestedFields,
        results,
        R.filter(isNested, fields)
    );
};

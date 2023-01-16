import { CollectionConfig, Field, TextField } from 'payload/types';
import * as R from 'ramda';

export const getLocalizedFields = (configuration: CollectionConfig) =>
    getLocalizedFieldsRecursively([], configuration.fields);

const isLocalizedText = (field: Field): boolean =>
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
    const reduceLocalizedField = (acc: string[][], textField: TextField) => [
        ...acc,
        [...path, textField.name],
    ];

    const localizedFields = R.filter(isLocalizedText, fields);
    const results = R.reduce(reduceLocalizedField, [], localizedFields);

    const reduceNestedField = (acc: string[][], nestedField: NestedField) => {
        const p = [...path, nestedField.name];
        const f = nestedField.fields;
        return [...acc, ...getLocalizedFieldsRecursively(p, f)];
    };

    const nestedFields: NestedField[] = R.filter(isNested, fields);
    return R.reduce(reduceNestedField, results, nestedFields);
};


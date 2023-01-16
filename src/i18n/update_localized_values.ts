import { CollectionConfig, Field, TextField } from 'payload/types';
import * as R from 'ramda';
import { getLocalizedFields } from './get_localized_fields';

export const updateLocalizedValues = (
    getText: (v: string) => string,
    configuration: CollectionConfig,
    object: any
) => {
    let result = { id: object['id'] };
    const fields = getLocalizedFields(configuration);
    fields.forEach((path: string[]) => {
        result = {
            ...result,
            ...updateLocalizedValuesRecursively(getText, path, object),
        };
    });
    return result;
};

const updateLocalizedValuesRecursively = (
    getText: (v: string) => string,
    path: string[],
    object: any
) => {
    if (R.isEmpty(path)) {
        return undefined;
    }
    if (R.is(Array, object[path[0]])) {
        let result = [];
        object[path[0]].forEach((element: any) => {
            const r = updateLocalizedValuesRecursively(
                getText,
                R.drop(1, path),
                element
            );
            result = [...result, r];
        });
        return { [path[0]]: result };
    }
    if (path.length === 1) {
        const oldValue = object[path[0]];
        const newValue = getText(oldValue);
        return { id: object.id, [path[0]]: newValue };
    }
    return updateLocalizedValuesRecursively(
        getText,
        R.drop(1, path),
        object[path[0]]
    );
};

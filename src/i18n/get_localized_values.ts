import * as R from 'ramda';

export interface LocalizedValue {
    value: string;
    breadCrumbs: string[];
}

export const getLocalizedValues = (
    paths: string[][],
    object: any
): LocalizedValue[] => {
    let result = [];
    paths.forEach((path: string[]) => {
        const r = getLocalizedValuesRecursively(path, [], object);
        result = R.flatten(R.append(r, result));
    });
    return result;
};

const getLocalizedValuesRecursively = (
    path: string[],
    breadCrumbs: string[],
    object: any
): LocalizedValue[] => {
    if (R.isEmpty(path)) {
        return [];
    }
    if (R.is(Array, object[path[0]])) {
        let result = [];
        let index = 0;
        object[path[0]].forEach((element: any) => {
            const b = [...breadCrumbs, path[0], String(index)];
            const r = getLocalizedValuesRecursively(
                R.drop(1, path),
                b,
                element
            );
            index += 1;
            result = [...result, r];
        });
        return result;
    }
    if (path.length === 1) {
        const v = R.is(String, object[path[0]]) ? object[path[0]] : undefined;
        if (!v) {
            return undefined;
        }
        const b = [...breadCrumbs, path[0]];
        return [{ value: v, breadCrumbs: b }];
    }
    const b = [...breadCrumbs, path[0]];
    return getLocalizedValuesRecursively(R.drop(1, path), b, object[path[0]]);
};


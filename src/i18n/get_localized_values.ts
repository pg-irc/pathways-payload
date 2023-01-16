import * as R from 'ramda';

export interface LocalizedValue {
    value: string;
    breadCrumbs: string;
}

export const getLocalizedValues = (
    slug: string,
    paths: string[][],
    object: any
): LocalizedValue[] => {
    let result = [];
    paths.forEach((path: string[]) => {
        const r = getLocalizedValuesRecursively(path, slug, object);
        result = R.flatten(R.append(r, result));
    });
    return result;
};

const getLocalizedValuesRecursively = (
    path: string[],
    breadCrumbs: string,
    object: any
): LocalizedValue[] => {
    if (R.isEmpty(path)) {
        return [];
    }
    if (R.is(Array, object[path[0]])) {
        let result = [];
        let index = 0;
        object[path[0]].forEach((element: any) => {
            const p = R.drop(1, path);
            const b = appendToBreadCrumbs(breadCrumbs, path[0], index);
            const r = getLocalizedValuesRecursively(p, b, element);
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
        const b = appendToBreadCrumbs(breadCrumbs, path[0]);
        return [{ value: v, breadCrumbs: b }];
    }
    const b = appendToBreadCrumbs(breadCrumbs, path[0]);
    return getLocalizedValuesRecursively(R.drop(1, path), b, object[path[0]]);
};

const appendToBreadCrumbs = (
    breadcrumbs: string,
    item: string | number,
    secondItem?: string | number
): string => {
    const isString = R.is(String, item);
    const result = isString
        ? breadcrumbs + '.' + item
        : breadcrumbs + '[' + String(item) + ']';
    if (secondItem === undefined) {
        return result;
    }
    return appendToBreadCrumbs(result, secondItem);
};

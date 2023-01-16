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
        return getLocalizedValuesFromArray(path, breadCrumbs, object);
    }
    if (path.length === 1) {
        return getLocalizedValueFromLeafNode(path, breadCrumbs, object);
    }
    const b = appendToBreadCrumbs(breadCrumbs, path[0]);
    return getLocalizedValuesRecursively(R.drop(1, path), b, object[path[0]]);
};

const getLocalizedValuesFromArray = (
    path: string[],
    breadCrumbs: string,
    object: Object
) => {
    let result = [];
    let index = 0;
    object[path[0]].forEach((element: any) => {
        const p = R.drop(1, path);
        const b = appendToBreadCrumbs(breadCrumbs, path[0], index);
        result = [...result, getLocalizedValuesRecursively(p, b, element)];
        index += 1;
    });
    return result;
};

const getLocalizedValueFromLeafNode = (
    path: string[],
    breadCrumbs,
    object: Object
) => {
    const isString = R.is(String, object[path[0]]);
    if (!isString) {
        return undefined;
    }
    const b = appendToBreadCrumbs(breadCrumbs, path[0]);
    return [{ value: object[path[0]], breadCrumbs: b }];
};

const appendToBreadCrumbs = (
    breadcrumbs: string,
    item: string | number,
    secondItem?: string | number
): string => {
    const isString = R.is(String, item);
    const result = isString
        ? `${breadcrumbs}.${item}`
        : `${breadcrumbs}[${item}]`;
    if (secondItem === undefined) {
        return result;
    }
    return appendToBreadCrumbs(result, secondItem);
};

import * as R from 'ramda';
import { LocalizedValue } from './get_localized_values';

export const formatPoData = (data: LocalizedValue[]): string => {
    let result = '';

    const sort = R.sortWith([
        R.ascend(R.prop('value')),
        R.prop('breadCrumbs'),
    ]);

    const sortedData = sort(data);

    sortedData.forEach((item: LocalizedValue): void => {
        result += `#: ${item.breadCrumbs}\nmsgid "${item.value}"\nmsgstr ""\n\n`;
    });
    return result;
};

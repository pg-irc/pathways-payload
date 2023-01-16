import * as R from 'ramda';
import { LocalizedValue } from './get_localized_values';

export const formatPoData = (data: LocalizedValue[]): string => {
    const sort = R.sortWith([
        R.ascend(R.prop('value')),
        R.ascend(R.prop('breadCrumbs')),
    ]);
    const sortedData = sort(data);

    let result = '';
    for (let i = 0; i < sortedData.length; i += 1) {
        const isDuplicate =
            i + 1 < sortedData.length &&
            sortedData[i].value === sortedData[i + 1].value;
        const item = sortedData[i];
        if (isDuplicate) {
            result += `#: ${item.breadCrumbs}\n`;
        } else {
            result += `#: ${item.breadCrumbs}\nmsgid "${item.value}"\nmsgstr ""\n\n`;
        }
    }
    return result;
};

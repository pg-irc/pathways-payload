import * as R from 'ramda';
import { LocalizedValue } from './get_localized_values';

export const formatPoData = (data: LocalizedValue[]): string => {
    const sort = R.sortWith([
        R.ascend(R.prop('value')),
        R.ascend(R.prop('breadCrumbs')),
    ]);

    const empty = { value: '', breadCrumbs: '' };
    const sortedPairs = R.aperture(2, R.append(empty, sort(data)));

    return R.reduce(
        (acc: string, pair: LocalizedValue[]) => {
            // empty value was appended above so the last element will not be forgotten here
            const item = pair[0];
            const isDuplicate = pair[0].value === pair[1].value;
            if (isDuplicate) {
                return `${acc}#: ${item.breadCrumbs}\n`;
            }
            return `${acc}#: ${item.breadCrumbs}\nmsgid "${item.value}"\nmsgstr ""\n\n`;
        },
        '',
        sortedPairs
    );
};

import * as R from 'ramda';

export const formatPoData = (data: string[]): string =>
    R.reduce(
        (acc: string, item: string) => `${acc}msgid "${item}"\nmsgstr ""\n\n`,
        '',
        data
    );

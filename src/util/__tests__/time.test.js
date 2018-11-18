import { i18nTimeFromMinutes } from '../time';
import { default as tz } from 'timezone-mock';

tz.register('UTC');

test.each([
  [0, 'ja', '10:00'],
  [280, null, '2:40 PM'],
  [1000, null, '2:40 AM'],
  [720, null, '10:00 PM'],
  [1440, null, '10:00 AM']
])('i18nTimeFromMinutes(%i, %s)',
  (timeInMinutes, locale, expected) => {
    const result = locale
      ? i18nTimeFromMinutes(timeInMinutes, locale)
      : i18nTimeFromMinutes(timeInMinutes);

    expect(result)
      .toEqual(expected);
  },
);

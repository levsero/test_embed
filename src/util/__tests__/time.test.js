import { i18nTimeFromMinutes } from '../time';

test.each([
  [0, 'ja', '23:00'],
  [280, null, '3:40 AM'],
  [1000, null, '3:40 PM'],
  [720, null, '11:00 AM'],
  [1440, null, '11:00 PM']
])('i18nTimeFromMinutes(%i, %s)',
  (timeInMinutes, locale, expected) => {
    const result = locale
      ? i18nTimeFromMinutes(timeInMinutes, locale)
      : i18nTimeFromMinutes(timeInMinutes);

    expect(result)
      .toEqual(expected);
  },
);

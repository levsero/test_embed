import { i18nTimeFromMinutes } from '../time';

test.each([
  [0, 'ja', '00:00'],
  [280, null, '4:40 AM'],
  [1000, null, '4:40 PM'],
  [720, null, '12:00 PM'],
  [1440, null, '12:00 AM']
])('i18nTimeFromMinutes(%i, %s)',
  (timeInMinutes, locale, expected) => {
    const result = locale
      ? i18nTimeFromMinutes(timeInMinutes, locale)
      : i18nTimeFromMinutes(timeInMinutes);

    expect(result)
      .toEqual(expected);
  },
);

import { dateTime } from '../formatters';
import { i18n } from 'service/i18n';

jest.mock('service/i18n');

i18n.getLocale = jest.fn(() => 'en-US');

describe('dateTime', () => {
  it('formats timestamp into a proper format', () => {
    expect(dateTime(new Date(1525654192982)))
      .toContain('May 7, 2018');
  });

  it('uses `today` translation string when `showToday` option is passed', () => {
    dateTime(Date.now(), { showToday: true });
    expect(i18n.t)
      .toHaveBeenCalledWith(
        'embeddable_framework.common.today',
        expect.objectContaining({
          time: expect.any(String)
        })
      );
  });

  it('does not throw error when locale is not supported', () => {
    i18n.getLocale = jest.fn(() => 'gibberish');

    expect(dateTime(new Date(1525654192982)))
      .toContain('May 7, 2018');
  });
});

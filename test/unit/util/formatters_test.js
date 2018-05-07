describe('formatters', () => {
  let dateTime;
  const formatterPath = buildSrcPath('util/formatters');

  beforeEach(() => {
    mockery.enable();

    const i18n = {
      t: _.identity
    };

    initMockRegistry({
      'service/i18n': {
        i18n
      }
    });

    mockery.registerAllowable(formatterPath);
    dateTime = requireUncached(formatterPath).dateTime;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('dateTime', () => {
    it('formats timestamp into a proper format', () => {
      expect(dateTime(new Date(1525654192982)))
        .toContain('May 7, 2018');
    });

    it('uses `today` translation string when `showToday` option is passed', () => {
      expect(dateTime(Date.now(), { showToday: true }))
        .toContain('embeddable_framework.common.today');
    });
  });
});

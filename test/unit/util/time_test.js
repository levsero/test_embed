describe('time', () => {
  let i18nTimeFromMinutes;
  const timePath = buildSrcPath('util/time');
  const dateTimeFormatterSpy = jasmine.createSpy('dateTimeFormatterSpy');

  beforeEach(() => {
    ({ i18nTimeFromMinutes } = requireUncached(timePath));
  });

  describe('#i18nTimeFromMinutes', () => {
    let timeInMinutes,
      locale;

    const defaultLocale = 'en-US';

    beforeAll(() => {
      spyOn(Intl, 'DateTimeFormat').and.returnValue({ format: dateTimeFormatterSpy });
    });

    beforeEach(() => {
      Intl.DateTimeFormat.calls.reset();
      dateTimeFormatterSpy.calls.reset();

      if (locale) {
        i18nTimeFromMinutes(timeInMinutes, locale);
      } else {
        i18nTimeFromMinutes(timeInMinutes);
      }
    });

    describe('when a different locale is set (ja)', () => {
      beforeAll(() => {
        timeInMinutes = 0;
        locale = 'ja';
      });

      afterAll(() => {
        locale = null;
      });

      it('calls the formatter and factory correctly', () => {
        expect(Intl.DateTimeFormat).toHaveBeenCalledWith(locale, jasmine.any(Object));
      });
    });

    describe('when the time is before noon', () => {
      beforeAll(() => {
        timeInMinutes = 280;
      });

      it('calls the formatter and factory correctly', () => {
        expect(Intl.DateTimeFormat).toHaveBeenCalledWith(defaultLocale, jasmine.any(Object));
        expect(dateTimeFormatterSpy).toHaveBeenCalledWith(new Date(2018, 10, 15, 4, 40, 0));
      });
    });

    describe('when the time is after noon', () => {
      beforeAll(() => {
        timeInMinutes = 1000;
      });

      it('calls the formatter and factory correctly', () => {
        expect(Intl.DateTimeFormat).toHaveBeenCalledWith(defaultLocale, jasmine.any(Object));
        expect(dateTimeFormatterSpy).toHaveBeenCalledWith(new Date(2018, 10, 15, 16, 40, 0));
      });
    });

    describe('when the time is exactly noon', () => {
      beforeAll(() => {
        timeInMinutes = 720;
      });

      it('calls the formatter and factory correctly', () => {
        expect(Intl.DateTimeFormat).toHaveBeenCalledWith(defaultLocale, jasmine.any(Object));
        expect(dateTimeFormatterSpy).toHaveBeenCalledWith(new Date(2018, 10, 15, 12, 0, 0));
      });
    });

    describe('when the time is exactly midnight (0 minutes)', () => {
      beforeAll(() => {
        timeInMinutes = 0;
      });

      it('calls the formatter and factory correctly', () => {
        expect(Intl.DateTimeFormat).toHaveBeenCalledWith(defaultLocale, jasmine.any(Object));
        expect(dateTimeFormatterSpy).toHaveBeenCalledWith(new Date(2018, 10, 15, 0, 0, 0));
      });
    });

    describe('when the time is exactly midnight (1440 minutes)', () => {
      beforeAll(() => {
        timeInMinutes = 1440;
      });

      it('calls the formatter and factory correctly', () => {
        expect(Intl.DateTimeFormat).toHaveBeenCalledWith(defaultLocale, jasmine.any(Object));
        expect(dateTimeFormatterSpy).toHaveBeenCalledWith(new Date(2018, 10, 15, 24, 0, 0));
      });
    });
  });
});

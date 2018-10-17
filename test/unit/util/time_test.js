describe('time', () => {
  let timeFromMinutes, i18nTimeFromMinutes;
  const timePath = buildSrcPath('util/time');

  beforeEach(() => {
    ({ timeFromMinutes, i18nTimeFromMinutes } = requireUncached(timePath));
  });

  describe('#timeFromMinutes', () => {
    let result,
      timeInMinutes,
      amString,
      pmString;

    beforeEach(() => {
      result = timeFromMinutes(timeInMinutes, amString, pmString);
    });

    describe('when the time is 24-hour time (military style)', () => {
      beforeAll(() => {
        timeInMinutes = 1000;
        amString = '';
        pmString = 'somethingThatShouldBeIgnored';
      });

      it('formats the time in 24-hour time style', () => {
        expect(result.time).toEqual('16:40');
      });

      it('recognises that the time should be the time in 24-hour style', () => {
        expect(result.is24Hour).toEqual(true);
      });

      it('passes no am/pm value', () => {
        expect(result.period).toEqual('');
      });
    });

    describe('when the time is 12-hour time (civilian style)', () => {
      beforeAll(() => {
        amString = 'am';
        pmString = 'pm';
      });

      describe('when the time is before noon', () => {
        beforeAll(() => {
          timeInMinutes = 280;
        });

        it('formats the time in 12-hour time style', () => {
          expect(result.time).toEqual('04:40');
        });

        it('recognises that the time should be the time in 12-hour style', () => {
          expect(result.is24Hour).toEqual(false);
        });

        it('passes the right period', () => {
          expect(result.period).toEqual('am');
        });
      });

      describe('when the time is after noon', () => {
        beforeAll(() => {
          timeInMinutes = 1000;
        });

        it('formats the time in 12-hour time style', () => {
          expect(result.time).toEqual('04:40');
        });

        it('recognises that the time should be the time in 12-hour style', () => {
          expect(result.is24Hour).toEqual(false);
        });

        it('passes the right period', () => {
          expect(result.period).toEqual('pm');
        });
      });

      describe('when the time is exactly noon', () => {
        beforeAll(() => {
          timeInMinutes = 720;
        });

        it('formats the time in 12-hour time style', () => {
          expect(result.time).toEqual('12:00');
        });

        it('recognises that the time should be the time in 12-hour style', () => {
          expect(result.is24Hour).toEqual(false);
        });

        it('passes the right period', () => {
          expect(result.period).toEqual('pm');
        });
      });

      describe('when the time is exactly midnight (0 minutes)', () => {
        beforeAll(() => {
          timeInMinutes = 0;
          amString = 'am';
          pmString = 'pm';
        });

        it('formats the time in 12-hour time style', () => {
          expect(result.time).toEqual('12:00');
        });

        it('recognises that the time should be the time in 12-hour style', () => {
          expect(result.is24Hour).toEqual(false);
        });

        it('passes the right period', () => {
          expect(result.period).toEqual('am');
        });
      });

      describe('when the time is exactly midnight (1440 minutes)', () => {
        beforeAll(() => {
          timeInMinutes = 1440;
          amString = 'am';
          pmString = 'pm';
        });

        it('formats the time in 12-hour time style', () => {
          expect(result.time).toEqual('12:00');
        });

        it('recognises that the time should be the time in 12-hour style', () => {
          expect(result.is24Hour).toEqual(false);
        });

        it('passes the right period', () => {
          expect(result.period).toEqual('am');
        });
      });
    });
  });

  describe('#i18nTimeFromMinutes', () => {
    let result,
      timeInMinutes,
      locale;

    beforeAll(() => {
      spyOn(Intl, 'DateTimeFormat').and.callFake(function(locale) {
        return {
          format: (d) => {
            if (locale === 'en') {
              const suffix = d.getHours() >= 12 && d.getHours() !== 0 ? 'PM' : 'AM';
              const hour = d.getHours() % 12 || 12;
              const minute = d.getMinutes().toString().padStart(2, '0');

              return `${hour}:${minute} ${suffix}`;
            } else {
              const hour = d.getHours().toString().padStart(2, '0');
              const minute = d.getMinutes().toString().padStart(2, '0');

              return `${hour}:${minute}`;
            }
          }
        };
      });
    });

    beforeEach(() => {
      result = i18nTimeFromMinutes(timeInMinutes, locale);
    });

    describe('when the locale uses 24-hour time', () => {
      beforeAll(() => {
        locale = 'ja';
      });

      describe('when the time is before noon', () => {
        beforeAll(() => {
          timeInMinutes = 280;
        });

        it('formats the time in 24-hour time style', () => {
          expect(result).toEqual('04:40');
        });
      });

      describe('when the time is after noon', () => {
        beforeAll(() => {
          timeInMinutes = 1000;
        });

        it('formats the time in 24-hour time style', () => {
          expect(result).toEqual('16:40');
        });
      });

      describe('when the time is exactly noon', () => {
        beforeAll(() => {
          timeInMinutes = 720;
        });

        it('formats the time in 24-hour time style', () => {
          expect(result).toEqual('12:00');
        });
      });

      describe('when the time is exactly midnight (0 minutes)', () => {
        beforeAll(() => {
          timeInMinutes = 0;
        });

        it('formats the time in 24-hour time style', () => {
          expect(result).toEqual('00:00');
        });
      });

      describe('when the time is exactly midnight (0 minutes)', () => {
        beforeAll(() => {
          timeInMinutes = 1440;
        });

        it('formats the time in 24-hour time style', () => {
          expect(result).toEqual('00:00');
        });
      });
    });

    describe('when the locale uses 12-hour time', () => {
      beforeAll(() => {
        locale = 'en';
      });

      describe('when the time is before noon', () => {
        beforeAll(() => {
          timeInMinutes = 280;
        });

        it('formats the time in 12-hour time style', () => {
          expect(result).toEqual('4:40 AM');
        });
      });

      describe('when the time is after noon', () => {
        beforeAll(() => {
          timeInMinutes = 1000;
        });

        it('formats the time in 12-hour time style', () => {
          expect(result).toEqual('4:40 PM');
        });
      });

      describe('when the time is exactly noon', () => {
        beforeAll(() => {
          timeInMinutes = 720;
        });

        it('formats the time in 12-hour time style', () => {
          expect(result).toEqual('12:00 PM');
        });
      });

      describe('when the time is exactly midnight (0 minutes)', () => {
        beforeAll(() => {
          timeInMinutes = 0;
          locale = 'en';
        });

        it('formats the time in 12-hour time style', () => {
          expect(result).toEqual('12:00 AM');
        });
      });

      describe('when the time is exactly midnight (0 minutes)', () => {
        beforeAll(() => {
          timeInMinutes = 1440;
          locale = 'en';
        });

        it('formats the time in 12-hour time style', () => {
          expect(result).toEqual('12:00 AM');
        });
      });
    });
  });
});

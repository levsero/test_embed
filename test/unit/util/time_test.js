describe('time', () => {
  let timeFromMinutes;
  const timePath = buildSrcPath('util/time');

  beforeEach(() => {
    timeFromMinutes = requireUncached(timePath).timeFromMinutes;
  });

  describe('#timeFromMinutes', () => {
    let result,
      timeInMinutes,
      amString,
      pmString;

    beforeEach(() => {
      result = timeFromMinutes(timeInMinutes, amString, pmString);
    });

    describe('when the time is 24 time (military style)', () => {
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

    describe('when the time is 12 time (civilian style)', () => {
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

      describe('when the time is exactly midnight', () => {
        beforeAll(() => {
          timeInMinutes = 0;
        });

        it('formats the time in 12-hour time style', () => {
          expect(result.time).toEqual('00:00');
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
});

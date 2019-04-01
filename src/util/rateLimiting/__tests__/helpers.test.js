import { exponentialBackoffTime, isRateLimited } from '../helpers';

describe('exponentialBackoffTime', () => {
  test.each([
    ['no values', [], 0],
    ['single value', [1], 1000],
    ['two values', [1, 2], 2000],
    ['three values', [1, 2, 3], 4000],
    ['four values', [1, 2, 3, 4], 8000],
    ['ten values', [1,2,4,5,6,7,8,9,10], 256000]
  ])('exponentialBackoffTime(%s)',
    (_, times, expected) => {
      expect(exponentialBackoffTime(times))
        .toEqual(expected);
    },
  );
});

describe('isRateLimited', () => {
  const timestamp = 1000;

  test.each([
    ['first request', 0, false],
    ['second request has no wait', 50, false],
    ['thrid request must wait 2 seconds', 2000, true],
    ['after waiting 2 seconds', 2100, false],
    ['third request before 4 seconds', 6000, true],
    ['waits 2 hours', 7300000, false],
    ['has been reset', 7300000, false],
    ['a third request must wait', 7300050, true],
  ])('exponentialBackoffTime(%s)',
    (_, time, expected) => {
      expect(isRateLimited('times', timestamp + time))
        .toEqual(expected);
    },
  );
});

describe('isRateLimited', () => {
  const timestamp = 1000;

  test.each([
    ['first request', 0, false],
    ['second request has no wait', 50, false],
    ['thrid request must wait 2 seconds', 2000, true],
    ['after waiting 2 seconds', 2100, false],
    ['third request before 4 seconds', 6000, true],
    ['waits 2 hours', 7300000, false],
    ['has been reset', 7300000, false],
    ['a third request must wait', 7300050, true],
  ])('exponentialBackoffTime(%s)',
    (_, time, expected) => {
      expect(isRateLimited('times', timestamp + time))
        .toEqual(expected);
    },
  );
});

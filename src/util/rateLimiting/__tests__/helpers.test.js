import { exponentialBackoffTime, isRateLimited } from '../helpers'

describe('exponentialBackoffTime', () => {
  test.each([
    ['no values', [], 0],
    ['single value', [1], 1000],
    ['two values', [1, 2], 2000],
    ['three values', [1, 2, 3], 4000],
    ['four values', [1, 2, 3, 4], 8000],
    ['ten values', [1, 2, 4, 5, 6, 7, 8, 9, 10], 256000]
  ])('exponentialBackoffTime(%s)', (_, times, expected) => {
    expect(exponentialBackoffTime(times)).toEqual(expected)
  })
})

describe('isRateLimited', () => {
  const timestamp = 1000

  test.each([
    ['first request', 0, false],
    ['second request must wait 1000', 50, true],
    ['second request works after 1000', 1000, false],
    ['thrid request must wait 2 seconds', 2900, true],
    ['after waiting 2 seconds', 3000, false],
    ['third request before 4 seconds', 6000, true],
    ['resets after 2 hours', 7300000, false],
    ['must wait 1 second', 7300050, true],
    ['works after 1 second', 7301000, false]
  ])('exponentialBackoffTime %s', (_, time, expected) => {
    expect(isRateLimited('times', timestamp + time)).toEqual(expected)
  })
})

import { dateTime } from '../formatters'

describe('dateTime', () => {
  describe('when passed a timestamp', () => {
    it('attempts to pass timestamp to client-i18n-tools', () => {
      expect(dateTime(1525654192982)).toEqual('May 7, 2018, 12:49 AM')
    })
  })

  describe('when `showToday` option is passed', () => {
    const originalDate = Date,
      originalNow = Date.now

    beforeEach(() => {
      global.Date = jest.fn(() => {
        return {
          getMonth: () => 1,
          getDate: () => 2,
          getFullYear: () => 3,
          getHours: () => 4,
          getMinutes: () => 5
        }
      })
      global.Date.now = jest.fn()
    })

    afterEach(() => {
      global.Date = originalDate
      global.Date.now = originalNow
    })

    it('translates Today string', () => {
      expect(dateTime(123, { showToday: true })).toEqual('Today 12:00 AM')
    })
  })
})

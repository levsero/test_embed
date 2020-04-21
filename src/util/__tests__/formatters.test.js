import { dateTime } from '../formatters'
import { i18n } from 'service/i18n'

i18n.getLocale = jest.fn(() => 'en-US')
i18n.t = jest.fn()

describe('dateTime', () => {
  describe('when passed a timestamp', () => {
    it('attempts to pass timestamp to client-i18n-tools', () => {
      expect(dateTime(1525654192982)).toEqual('1525654192982')
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

    it('attempts to translate Today string', () => {
      dateTime(123, { showToday: true })
      expect(i18n.t).toHaveBeenCalledWith(
        'embeddable_framework.common.today',
        expect.objectContaining({
          time: expect.any(String)
        })
      )
    })
  })

  it('does not throw error when locale is not supported', () => {
    i18n.getLocale = jest.fn(() => 'gibberish')

    expect(dateTime(1525654192982)).toEqual('1525654192982')
  })
})

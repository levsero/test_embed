import * as libphonenumber from 'libphonenumber-js'
import getFormattedPhoneNumber from '../getFormattedPhoneNumber'

jest.mock('libphonenumber-js')

describe('getFormattedPhoneNumber', () => {
  it('returns the formatted phone number', () => {
    const value = 'phone number'
    const parsedValue = 'parsed phone number'
    const formattedValue = 'formatted phone number'

    libphonenumber.parse.mockReturnValue(parsedValue)
    libphonenumber.format.mockReturnValue(formattedValue)

    const result = getFormattedPhoneNumber(value)

    expect(libphonenumber.parse).toHaveBeenCalledWith(value)
    expect(libphonenumber.format).toHaveBeenCalledWith(parsedValue, 'International')
    expect(result).toEqual(formattedValue)
  })
})

import * as selectors from '../reselectors'

const talkConfig = state => ({
  talk: state
})

test('getPhoneNumber', () => {
  const selector = selectors.getPhoneNumber.resultFunc
  const config = {
    averageWaitTime: '5',
    phoneNumber: '01189998819991197253'
  }

  expect(selector(config)).toEqual(config.phoneNumber)
})

describe('getFormattedPhoneNumber', () => {
  const stubbedFormat = jest.fn().mockReturnValue('formatted phone')
  const state = parse => ({
    embeddableConfig: {
      phoneNumber: '1231231'
    },
    vendor: {
      libphonenumber: {
        parse,
        format: stubbedFormat
      }
    }
  })

  it('makes the correct calls', () => {
    const stubbedParse = jest.fn().mockReturnValue('parsed phone')

    expect(selectors.getFormattedPhoneNumber(talkConfig(state(stubbedParse)))).toEqual(
      'formatted phone'
    )
    expect(stubbedParse).toHaveBeenCalledWith('1231231')
    expect(stubbedFormat).toHaveBeenCalledWith('parsed phone', 'International')
  })

  describe('when libphonenumber throws an error', () => {
    it('returns null', () => {
      const stubbedParse = jest.fn(() => {
        throw new Error()
      })

      expect(selectors.getFormattedPhoneNumber(talkConfig(state(stubbedParse)))).toBeNull()
    })
  })
})

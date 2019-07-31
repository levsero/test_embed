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
  it('makes the correct calls', () => {
    const stubbedFormat = jest.fn().mockReturnValue('formatted phone')
    const stubbedParse = jest.fn().mockReturnValue('parsed phone')
    const state = {
      embeddableConfig: {
        phoneNumber: '1231231'
      },
      vendor: {
        libphonenumber: {
          parse: stubbedParse,
          format: stubbedFormat
        }
      }
    }

    expect(selectors.getFormattedPhoneNumber(talkConfig(state))).toEqual('formatted phone')
    expect(stubbedParse).toHaveBeenCalledWith('1231231')
    expect(stubbedFormat).toHaveBeenCalledWith('parsed phone', 'International')
  })
})

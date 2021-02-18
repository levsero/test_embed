import * as selectors from '../reselectors'

test('getPhoneNumber', () => {
  const selector = selectors.getPhoneNumber.resultFunc
  const config = {
    averageWaitTime: '5',
    phoneNumber: '01189998819991197253',
  }

  expect(selector(config)).toEqual(config.phoneNumber)
})

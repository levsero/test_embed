import * as selectors from '../talk-selectors'
import { PHONE_ONLY, CALLBACK_ONLY, CALLBACK_AND_PHONE } from '../talk-capability-types'
import { CALLBACK_SCREEN, PHONE_US_SCREEN } from 'src/redux/modules/talk/talk-screen-types'

const embeddableConfig = state => ({
  talk: {
    embeddableConfig: state
  }
})

const talkConfig = state => ({
  talk: state
})

test('getEmbeddableConfig returns the embeddableConfig object', () => {
  const state = {
    a: 123
  }

  expect(selectors.getEmbeddableConfig(embeddableConfig(state))).toEqual(state)
})

test('getCapability returns the capability', () => {
  const state = {
    capability: 'abc'
  }

  expect(selectors.getCapability(embeddableConfig(state))).toEqual('abc')
})

test('getEmbeddableConfigEnabled returns if config is enabled', () => {
  const state = {
    enabled: true
  }

  expect(selectors.getEmbeddableConfigEnabled(embeddableConfig(state))).toEqual(true)
})

test('getEmbeddableConfigConnected returns connected', () => {
  const state = {
    connected: true
  }

  expect(selectors.getEmbeddableConfigConnected(embeddableConfig(state))).toEqual(true)
})

test('getAgentAvailability returns the availability', () => {
  const state = {
    agentAvailability: true
  }

  expect(selectors.getAgentAvailability(talkConfig(state))).toEqual(true)
})

test('getFormState returns the form state', () => {
  const state = {
    formState: {
      phone: 'fasdf',
      name: 'blah'
    }
  }

  expect(selectors.getFormState(talkConfig(state))).toEqual(state.formState)
})

test('getScreen returns the form state', () => {
  const state = {
    screen: 'form'
  }

  expect(selectors.getScreen(talkConfig(state))).toEqual('form')
})

test('getScreen returns the form state', () => {
  const state = {
    screen: 'form'
  }

  expect(selectors.getScreen(talkConfig(state))).toEqual('form')
})

test('getCallback returns the callback object', () => {
  const state = {
    callback: {
      blah: true
    }
  }

  expect(selectors.getCallback(talkConfig(state))).toEqual(state.callback)
})

test('getAverageWaitTime returns the callback object', () => {
  const state = {
    averageWaitTime: {
      waitTime: '5'
    }
  }

  expect(selectors.getAverageWaitTime(talkConfig(state))).toEqual('5')
})

test('getAverageWaitTimeEnabled returns the callback object', () => {
  const state = {
    averageWaitTime: {
      enabled: true
    }
  }

  expect(selectors.getAverageWaitTimeEnabled(talkConfig(state))).toEqual(true)
})

describe('getInitialScreen', () => {
  test('getInitialScreen returns CALLBACK_SCREEN when capability is CALLBACK_ONLY', () => {
    const state = {
      capability: CALLBACK_ONLY
    }

    expect(selectors.getInitialScreen(embeddableConfig(state))).toEqual(CALLBACK_SCREEN)
  })

  test('getInitialScreen returns CALLBACK_SCREEN when capability is CALLBACK_AND_PHONE', () => {
    const state = {
      capability: CALLBACK_AND_PHONE
    }

    expect(selectors.getInitialScreen(embeddableConfig(state))).toEqual(CALLBACK_SCREEN)
  })

  test('getInitialScreen returns PHONE_US_SCREEN when capability is PHONE_ONLY', () => {
    const state = {
      capability: PHONE_ONLY
    }

    expect(selectors.getInitialScreen(embeddableConfig(state))).toEqual(PHONE_US_SCREEN)
  })
})

test('getSocketIoVendor returns the socket.io vendor', () => {
  const state = {
    vendor: {
      io: {
        blah: 'blah'
      }
    }
  }

  expect(selectors.getSocketIoVendor(talkConfig(state))).toEqual({
    blah: 'blah'
  })
})

test('getLibPhoneNumberVendor returns the libphonenumber vendor', () => {
  const state = {
    vendor: {
      libphonenumber: {
        blah: 'blah'
      }
    }
  }

  expect(selectors.getLibPhoneNumberVendor(talkConfig(state))).toEqual({
    blah: 'blah'
  })
})

test.each([[PHONE_ONLY, false], [CALLBACK_ONLY, true], [CALLBACK_AND_PHONE, true]])(
  'isCallbackEnabled(%s)',
  (capability, expected) => {
    expect(selectors.isCallbackEnabled(embeddableConfig({ capability }))).toEqual(expected)
  }
)

describe('getAverageWaitTimeString', () => {
  test.each([
    ['average wait time is not enabled', false, '1', null],
    ['average wait time is enabled and wait time is 0', true, '0', null],
    ['average wait time is enabled and wait time is 1', true, '1', 'Average wait time: 1 minute'],
    ['average wait time is enabled and wait time is 2', true, '2', 'Average wait time: 2 minutes']
  ])('%p', (__title, averageWaitTimeEnabled, averageWaitTime, expectedValue) => {
    const result = selectors.getAverageWaitTimeString.resultFunc(
      averageWaitTimeEnabled,
      averageWaitTime
    )

    expect(result).toEqual(expectedValue)
  })
})

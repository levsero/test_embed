import * as selectors from 'classicSrc/embeds/talk/selectors'
import {
  PHONE_ONLY,
  CALLBACK_ONLY,
  CALLBACK_AND_PHONE,
  CLICK_TO_CALL,
} from 'classicSrc/embeds/talk/talk-capability-types'

const embeddableConfig = (state) => ({
  talk: {
    embeddableConfig: state,
  },
})

const talkConfig = (state) => ({
  talk: state,
})

test('getTalkEmbeddableConfig returns the embeddableConfig object', () => {
  const state = {
    a: 123,
  }

  expect(selectors.getTalkEmbeddableConfig(embeddableConfig(state))).toEqual(state)
})

test('getEmbeddableConfigEnabled returns if config is enabled', () => {
  const state = {
    enabled: true,
  }

  expect(selectors.getEmbeddableConfigEnabled(embeddableConfig(state))).toEqual(true)
})

test('getTalkEmbeddableConfigConnected returns connected', () => {
  const state = {
    connected: true,
  }

  expect(selectors.getTalkEmbeddableConfigConnected(embeddableConfig(state))).toEqual(true)
})

test('getAgentAvailability returns the availability', () => {
  const state = {
    agentAvailability: true,
  }

  expect(selectors.getAgentAvailability(talkConfig(state))).toEqual(true)
})

test('getFormState returns the form state', () => {
  const state = {
    formState: {
      phone: 'fasdf',
      name: 'blah',
    },
  }

  expect(selectors.getFormState(talkConfig(state))).toEqual(state.formState)
})

test('getCallback returns the callback object', () => {
  const state = {
    callback: {
      blah: true,
    },
  }

  expect(selectors.getCallback(talkConfig(state))).toEqual(state.callback)
})

test('getAverageWaitTime returns the callback object', () => {
  const state = {
    averageWaitTime: {
      waitTime: '5',
    },
  }

  expect(selectors.getAverageWaitTime(talkConfig(state))).toEqual('5')
})

test('getAverageWaitTimeEnabled returns the callback object', () => {
  const state = {
    averageWaitTime: {
      enabled: true,
    },
  }

  expect(selectors.getAverageWaitTimeEnabled(talkConfig(state))).toEqual(true)
})

test('getSocketIoVendor returns the socket.io vendor', () => {
  const state = {
    vendor: {
      io: {
        blah: 'blah',
      },
    },
  }

  expect(selectors.getSocketIoVendor(talkConfig(state))).toEqual({
    blah: 'blah',
  })
})

test.each([
  [PHONE_ONLY, false],
  [CALLBACK_ONLY, true],
  [CALLBACK_AND_PHONE, true],
])('isCallbackEnabled(%s)', (capability, expected) => {
  expect(selectors.isCallbackEnabled(embeddableConfig({ capability }))).toEqual(expected)
})

describe('getAverageWaitTimeString', () => {
  test.each([
    ['average wait time is not enabled', false, '1', null],
    ['average wait time is enabled and wait time is 0', true, '0', null],
    ['average wait time is enabled and wait time is 1', true, '1', 'Average wait time: 1 minute'],
    ['average wait time is enabled and wait time is 2', true, '2', 'Average wait time: 2 minutes'],
  ])('%p', (__title, averageWaitTimeEnabled, averageWaitTime, expectedValue) => {
    const result = selectors.getAverageWaitTimeString.resultFunc(
      averageWaitTimeEnabled,
      averageWaitTime
    )

    expect(result).toEqual(expectedValue)
  })
})

describe('getIsEmbeddedVoiceEnabled', () => {
  test.each([
    [CLICK_TO_CALL, true],
    [PHONE_ONLY, false],
    [CALLBACK_ONLY, false],
    [CALLBACK_AND_PHONE, false],
  ])('when talk capability is %p the return value is %p', (capability, expectedValue) => {
    expect(
      selectors.getIsEmbeddedVoiceEnabled({
        talk: { embeddableConfig: { capability } },
      })
    ).toEqual(expectedValue)
  })
})

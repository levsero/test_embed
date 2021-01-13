import { CONTACT_OPTIONS } from 'src/embeds/talk/constants'
import {
  CLICK_TO_CALL,
  PHONE_ONLY,
  CALLBACK_ONLY,
  CALLBACK_AND_PHONE
} from 'src/redux/modules/talk/talk-capability-types'

import {
  getOfflineTitle,
  getTalkTitleKey,
  getCapability,
  getCallInProgressLabel
} from '../selectors'

describe('talk selectors', () => {
  describe('getCapability returns the capability', () => {
    test.each([
      [CLICK_TO_CALL, true, CLICK_TO_CALL],
      [CLICK_TO_CALL, null, CLICK_TO_CALL],
      [CALLBACK_ONLY, true, CLICK_TO_CALL],
      [CALLBACK_ONLY, null, CALLBACK_ONLY],
      [PHONE_ONLY, null, PHONE_ONLY],
      [CALLBACK_AND_PHONE, null, CALLBACK_AND_PHONE],
      [CALLBACK_AND_PHONE, false, CALLBACK_AND_PHONE]
    ])(
      'When config state is %p, digitalVoiceSupported is %p, expect to return %p',
      (state, digitalVoiceSupported, expectedValue) => {
        const config = { capability: state }
        const result = getCapability.resultFunc(config, digitalVoiceSupported)
        expect(result).toEqual(expectedValue)
      }
    )
  })

  describe('getOfflineTitle', () => {
    const createState = (title, capability) => ({
      settings: { talk: { title } },
      talk: { embeddableConfig: { capability } }
    })

    describe('when no custom talk title set', () => {
      it('returns phone only title when capability is phone only', () => {
        const state = createState(undefined, CONTACT_OPTIONS.PHONE_ONLY)

        expect(getOfflineTitle(state)).toBe('Call us')
      })

      it('returns callback title when capability is callback only', () => {
        const state = createState(undefined, CONTACT_OPTIONS.CALLBACK_ONLY)

        expect(getOfflineTitle(state)).toBe('Request a callback')
      })

      it('returns callback title when capability is callback and phone', () => {
        const state = createState(undefined, CONTACT_OPTIONS.CALLBACK_AND_PHONE)

        expect(getOfflineTitle(state)).toBe('Request a callback')
      })

      it('returns callback title when capability is an unknown value', () => {
        const state = createState(undefined, 'something random')

        expect(getOfflineTitle(state)).toBe('Request a callback')
      })
    })
  })

  describe('getTalkTitleKey', () => {
    test.each([
      [CLICK_TO_CALL, true, 'embeddable_framework.talk.clickToCall.header.title'],
      [CLICK_TO_CALL, false, 'embeddable_framework.talk.clickToCall.header.title'],
      ['something else', true, 'embeddable_framework.launcher.label.talk.request_callback'],
      ['something else', false, 'embeddable_framework.launcher.label.talk.call_us']
    ])(
      'When capability is %p, callbackEnabled is %p, expect %p',
      (capability, callbackEnabled, expectedValue) => {
        const result = getTalkTitleKey.resultFunc(capability, callbackEnabled)

        expect(result).toEqual(expectedValue)
      }
    )
  })

  describe('getCallInProgressLabel returns the callInProgressLabel from state', () => {
    expect(getCallInProgressLabel({ talk: { callInProgressLabel: 'Bob' } })).toEqual('Bob')
  })
})

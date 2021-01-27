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
      'When config state is %p, embeddedVoiceSupported is %p, expect to return %p',
      (state, embeddedVoiceSupported, expectedValue) => {
        const config = { capability: state }
        const result = getCapability.resultFunc(config, embeddedVoiceSupported)
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
      [CLICK_TO_CALL, true, 'embeddable_framework.talk.embeddedVoice.channel.title'],
      [CLICK_TO_CALL, false, 'embeddable_framework.talk.embeddedVoice.channel.title'],
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

  describe('getCallInProgressLabel', () => {
    it('returns call in progress when call is in progress', () => {
      expect(
        getCallInProgressLabel({ talk: { embeddedVoiceCallStatus: { isCallInProgress: true } } })
      ).toEqual('Call in progress')
    })

    it('returns call ended when a call is not in progress', () => {
      expect(
        getCallInProgressLabel({ talk: { embeddedVoiceCallStatus: { isCallInProgress: false } } })
      ).toEqual('Call ended')
    })

    it('returns call failed whenever an error has occurred', () => {
      expect(
        getCallInProgressLabel({
          talk: { embeddedVoiceCallStatus: { isCallInProgress: false, hasLastCallFailed: true } }
        })
      ).toEqual('Call failed')

      expect(
        getCallInProgressLabel({
          talk: { embeddedVoiceCallStatus: { isCallInProgress: true, hasLastCallFailed: true } }
        })
      ).toEqual('Call failed')
    })
  })
})

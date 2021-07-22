import { API_GET_IS_CHATTING_NAME } from 'constants/api'
import * as apis from 'service/api/apis'
import tracker from 'service/tracker'
import publicApi from 'src/framework/services/publicApi'
import { apiResetWidget, legacyShowReceived } from 'src/redux/modules/base'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import { getWebWidgetPublicApi } from '../setupApi'
import { getWebWidgetLegacyPublicApi } from '../setupLegacyApi'

jest.mock('service/tracker')
jest.mock('src/redux/modules/base')
jest.mock('src/service/renderer')
jest.mock('src/service/api/apis')

const mockStore = {
  dispatch: jest.fn(),
  getState: jest.fn(),
}

const isMessengerWidget = false

publicApi.registerApi(getWebWidgetPublicApi(mockStore))
publicApi.registerLegacyApi(getWebWidgetLegacyPublicApi(mockStore, {}))
publicApi.run(isMessengerWidget)

describe('pre render methods', () => {
  describe('when that call is show', () => {
    beforeEach(() => {
      zE('webWidget', 'show')
    })

    it('calls showApi', () => {
      expect(apis.showApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.show')
    })
  })

  describe('when that call is open', () => {
    beforeEach(() => {
      zE('webWidget', 'open')
    })

    it('calls openApi', () => {
      expect(apis.openApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.open')
    })
  })

  describe('when that call is close', () => {
    beforeEach(() => {
      zE('webWidget', 'close')
    })

    it('calls closeApi', () => {
      expect(apis.closeApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.close')
    })
  })

  describe('when that call is toggle', () => {
    beforeEach(() => {
      zE('webWidget', 'toggle')
    })

    it('calls toggleApi', () => {
      expect(apis.toggleApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.toggle')
    })
  })

  describe('when that call is setLocale', () => {
    beforeEach(() => {
      zE('webWidget', 'setLocale', 'fr')
    })

    it('calls i18n setLocale with the locale', () => {
      expect(apis.setLocaleApi).toHaveBeenCalledWith(mockStore, 'fr')
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.setLocale', 'fr')
    })
  })

  describe('when the call is clear', () => {
    beforeEach(() => {
      zE('webWidget', 'clear')
    })

    it('calls clearFormState', () => {
      expect(apis.clearFormState).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.clear')
    })
  })

  describe('when that call is reset', () => {
    describe('and getLauncherVisible is true', () => {
      let spy

      beforeEach(() => {
        spy = jest
          .spyOn(baseSelectors, 'getLauncherVisible')
          .mockImplementation(jest.fn(() => true))
        zE('webWidget', 'reset')
      })

      afterEach(() => spy.mockRestore())

      it('calls resetWidget', () => {
        expect(apiResetWidget).toHaveBeenCalled()
      })
    })

    describe('and getLauncherVisible is false', () => {
      let spy

      beforeEach(() => {
        spy = jest
          .spyOn(baseSelectors, 'getLauncherVisible')
          .mockImplementation(jest.fn(() => false))
        zE('webWidget', 'reset')
      })

      afterEach(() => spy.mockRestore())

      it('does not call resetWidget', () => {
        expect(apiResetWidget).not.toHaveBeenCalled()
      })
    })
  })

  describe('methods that get queued', () => {
    describe('when that call is identity', () => {
      const user = { email: 'a2b.c' }

      beforeEach(() => {
        zE('webWidget', 'identify', user)
      })

      it('calls mediator onIdentify with the user', () => {
        expect(apis.identifyApi).toHaveBeenCalledWith(mockStore, user)
      })
    })

    describe('when that call is prefill', () => {
      const payload = {
        name: { value: 'Terence', readOnly: true },
        email: { value: 'a2b.c' },
      }

      beforeEach(() => {
        zE('webWidget', 'prefill', payload)
      })

      it('calls prefill api with the user', () => {
        expect(apis.prefill).toHaveBeenCalledWith(mockStore, payload)
      })

      it('tracks the call', () => {
        expect(tracker.track).toHaveBeenCalledWith('webWidget.prefill', payload)
      })
    })

    describe('when that call is updateSettings', () => {
      const settings = { webWidget: { color: '#fff' } }

      beforeEach(() => {
        zE('webWidget', 'updateSettings', settings)
      })

      it('calls updateSettings with the settings', () => {
        expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, settings)
      })

      it('tracks the call', () => {
        expect(tracker.track).toHaveBeenCalledWith('webWidget.updateSettings', settings)
      })
    })

    describe('when that call is logout', () => {
      beforeEach(() => {
        zE('webWidget', 'logout')
      })

      it('calls logout', () => {
        expect(apis.logoutApi).toHaveBeenCalled()
      })

      it('tracks the call', () => {
        expect(tracker.track).toHaveBeenCalledWith('webWidget.logout')
      })
    })

    describe('when that call is setHelpCenterSuggestions', () => {
      const options = { url: true }

      beforeEach(() => {
        zE('webWidget', 'helpCenter:setSuggestions', options)
      })

      it('calls setHelpCenterSuggestions with the options', () => {
        expect(apis.setHelpCenterSuggestionsApi).toHaveBeenCalledWith(mockStore, options)
      })

      it('tracks the call', () => {
        expect(tracker.track).toHaveBeenCalledWith('webWidget.helpCenter:setSuggestions', options)
      })
    })

    describe('when that call is updatePath', () => {
      const options = { title: 'payments', url: 'https://zd.com#payments' }

      beforeEach(() => {
        zE('webWidget', 'updatePath', options)
      })

      it('calls updatePathApi with the options', () => {
        expect(apis.updatePathApi).toHaveBeenCalledWith(mockStore, options)
      })

      it('tracks the call', () => {
        expect(tracker.track).toHaveBeenCalledWith('webWidget.updatePath', options)
      })
    })

    describe('when that call is get', () => {
      beforeEach(() => {
        zE('webWidget:get', 'chat:isChatting')
      })

      it('calls isChattingApi', () => {
        expect(apis.isChattingApi).toHaveBeenCalled()
      })

      it('tracks the call', () => {
        expect(tracker.track).toHaveBeenCalledWith(`webWidget:get.chat:isChatting`)
      })
    })
  })
})

describe('post render methods', () => {
  let result

  describe('when that call is hide', () => {
    beforeEach(() => {
      zE('webWidget', 'hide')
    })

    it('calls hideApi', () => {
      expect(apis.hideApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.hide')
    })
  })

  describe('when that call is show', () => {
    beforeEach(() => {
      zE('webWidget', 'show')
    })

    it('calls showApi', () => {
      expect(apis.showApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.show')
    })
  })

  describe('when that call is open', () => {
    beforeEach(() => {
      zE('webWidget', 'open')
    })

    it('calls openApi', () => {
      expect(apis.openApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.open')
    })
  })

  describe('when that call is close', () => {
    beforeEach(() => {
      zE('webWidget', 'close')
    })

    it('calls close', () => {
      expect(apis.closeApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.close')
    })
  })

  describe('when that call is toggle', () => {
    beforeEach(() => {
      zE('webWidget', 'toggle')
    })

    it('calls toggleApi', () => {
      expect(apis.toggleApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.toggle')
    })
  })

  describe('when that call is reset', () => {
    describe('and getLauncherVisible is true', () => {
      let spy

      it('calls resetWidget', () => {
        spy = jest
          .spyOn(baseSelectors, 'getLauncherVisible')
          .mockImplementation(jest.fn(() => true))
        zE('webWidget', 'reset')
        expect(apiResetWidget).toHaveBeenCalled()
        spy.mockRestore()
      })
    })

    describe('and getLauncherVisible is false', () => {
      let spy

      it('does not call resetWidget', () => {
        spy = jest
          .spyOn(baseSelectors, 'getLauncherVisible')
          .mockImplementation(jest.fn(() => false))
        zE('webWidget', 'reset')
        expect(apiResetWidget).not.toHaveBeenCalled()
        spy.mockRestore()
      })
    })
  })

  describe('when that call is setLocale', () => {
    beforeEach(() => {
      zE('webWidget', 'setLocale', 'fr')
    })

    it('calls i18n setLocale with the locale', () => {
      expect(apis.setLocaleApi).toHaveBeenCalledWith(mockStore, 'fr')
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.setLocale', 'fr')
    })
  })

  describe('when that call is identify', () => {
    const user = { email: 'a2b.c' }

    beforeEach(() => {
      zE('webWidget', 'identify', user)
    })

    it('calls mediator onIdentify with the user', () => {
      expect(apis.identifyApi).toHaveBeenCalledWith(mockStore, user)
    })
  })

  describe('when that call is prefill', () => {
    const payload = {
      name: { value: 'T-bone', readOnly: true },
      email: { value: 'a2b.c' },
    }

    beforeEach(() => {
      zE('webWidget', 'prefill', payload)
    })

    it('calls prefill api with the user', () => {
      expect(apis.prefill).toHaveBeenCalledWith(mockStore, payload)
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.prefill', payload)
    })
  })

  describe('when that call is updateSettings', () => {
    const settings = { webWidget: { color: '#fff' } }

    beforeEach(() => {
      zE('webWidget', 'updateSettings', settings)
    })

    it('calls updateSettings with the settings', () => {
      expect(apis.updateSettingsApi).toHaveBeenCalledWith(mockStore, settings)
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.updateSettings', settings)
    })
  })

  describe('when that call is logout', () => {
    beforeEach(() => {
      zE('webWidget', 'logout')
    })

    it('calls logout', () => {
      expect(apis.logoutApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.logout')
    })
  })

  describe('when that call is setHelpCenterSuggestions', () => {
    const options = { url: true }

    beforeEach(() => {
      zE('webWidget', 'helpCenter:setSuggestions', options)
    })

    it('calls setHelpCenterSuggestions with the options', () => {
      expect(apis.setHelpCenterSuggestionsApi).toHaveBeenCalledWith(mockStore, options)
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.helpCenter:setSuggestions', options)
    })
  })

  describe('when that call is updatePath', () => {
    const options = { title: 'payments', url: 'https://zd.com#payments' }

    beforeEach(() => {
      zE('webWidget', 'updatePath', options)
    })

    it('calls updatePath with the options', () => {
      expect(apis.updatePathApi).toHaveBeenCalledWith(mockStore, options)
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.updatePath', options)
    })
  })

  describe('when that call is endChat', () => {
    beforeEach(() => {
      zE('webWidget', 'chat:end')
    })

    it('calls endChat with the options', () => {
      expect(apis.endChatApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.chat:end')
    })
  })

  describe('when that call is sendChatMsg', () => {
    beforeEach(() => {
      zE('webWidget', 'chat:send')
    })

    it('calls sendMsg with the options', () => {
      expect(apis.sendChatMsgApi).toHaveBeenCalled()
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget.chat:send')
    })
  })

  describe('when that call is on', () => {
    beforeEach(() => {
      jest.spyOn(apis, 'onApiObj').mockReturnValue({ close: jest.fn() })
      zE('webWidget:on', 'close', () => {})
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget:on.close', expect.any(Function))
    })
  })

  describe('when that call is get', () => {
    describe('when the param is part of the allowList', () => {
      beforeEach(() => {
        apis.isChattingApi.mockReturnValue('1234')
        result = zE('webWidget:get', `chat:${API_GET_IS_CHATTING_NAME}`)
      })

      it('calls isChattingApi', () => {
        expect(apis.isChattingApi).toHaveBeenCalled()
      })

      it('returns the expected value', () => {
        expect(result).toEqual('1234')
      })

      it('tracks the call', () => {
        expect(tracker.track).toHaveBeenCalledWith(`webWidget:get.chat:${API_GET_IS_CHATTING_NAME}`)
      })
    })
  })

  describe('when that call is a non-existent method', () => {
    it('throws an error', () => {
      expect(() => {
        zE('webWidget:dude', 'blob')
      }).toThrow('Method webWidget:dude.blob does not exist')
    })
  })
})

describe('legacy apis', () => {
  const user = {
    name: 'Jane Doe',
    email: 'a@b.c',
  }

  describe('zE.show', () => {
    describe('when widget already shown', () => {
      beforeEach(() => {
        jest.spyOn(baseSelectors, 'getWidgetAlreadyHidden').mockReturnValue(true)
        legacyShowReceived.mockReturnValue({ type: 'show' })
        zE.show()
      })

      it('calls tracker on win.zE', () => {
        expect(legacyShowReceived).toHaveBeenCalled()
        expect(mockStore.dispatch).toHaveBeenCalledWith({ type: 'show' })
      })
    })

    describe('when widget hidden', () => {
      beforeEach(() => {
        jest.spyOn(baseSelectors, 'getWidgetAlreadyHidden').mockReturnValue(false)
        legacyShowReceived.mockReturnValue({ type: 'show' })
        zE.show()
      })

      it('calls tracker on win.zE', () => {
        expect(legacyShowReceived).not.toHaveBeenCalled()
        expect(mockStore.dispatch).not.toHaveBeenCalledWith()
      })
    })
  })

  describe('zE.identify', () => {
    beforeEach(() => {
      zE.identify(user)
    })

    it('calls handlePrefillReceived with the formatted user object', () => {
      const expected = {
        name: { value: 'Jane Doe' },
        email: { value: 'a@b.c' },
      }

      expect(apis.prefill).toHaveBeenCalledWith(mockStore, expected)
    })
  })
})

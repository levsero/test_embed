import api from '..'
import * as apis from 'service/api/apis'
import tracker from 'service/tracker'
import { apiResetWidget, legacyShowReceived } from 'src/redux/modules/base'
import * as baseSelectors from 'src/redux/modules/base/base-selectors'
import { API_GET_IS_CHATTING_NAME } from 'constants/api'
import { apiExecute, apiStructurePostRenderSetup } from './../setupApi'

jest.mock('service/api/apis')
jest.mock('service/tracker')
jest.mock('src/redux/modules/base')
jest.mock('src/service/renderer')

const mockStore = {
  dispatch: jest.fn(),
  getState: jest.fn()
}

describe('apisExecuteQueue', () => {
  describe('when the queue method is a function', () => {
    const queueSpy = jest.fn()

    beforeEach(() => {
      api.apisExecuteQueue(null, [[queueSpy]])
    })

    it('calls the function in the queue', () => {
      expect(queueSpy).toHaveBeenCalled()
    })
  })

  describe('when the queue method is a string', () => {
    describe('that describes a valid api method', () => {
      beforeEach(() => {
        api.apisExecuteQueue(mockStore, [['webWidget', 'hide']])
      })

      it('handles the api call', () => {
        expect(apis.hideApi).toHaveBeenCalled()
      })

      it('tracks the call', () => {
        expect(tracker.track).toHaveBeenCalledWith('webWidget.hide')
      })
    })

    describe('that does not match a valid api method', () => {
      /* eslint-disable no-console */
      beforeEach(() => {
        jest.spyOn(console, 'error')
        console.error.mockReturnValue()
        api.apisExecuteQueue(mockStore, [['wabWadgit', 'dood']])
      })

      afterEach(() => {
        console.error.mockRestore()
      })

      it('logs the error', () => {
        expect(console.error).toHaveBeenCalledWith(
          expect.stringMatching(
            /An error occurred in your use of the Zendesk Widget API:\s+wabWadgit/
          )
        )
      })
      /* eslint-enablle no-console */
    })
  })
})

describe('setupLegacyApiQueue', () => {
  describe('win.zEmbed', () => {
    const fireSetup = (win = { zEmbed: { t: 'hello fren' } }) => {
      api.setupLegacyApiQueue(win, [], mockStore)
      return win
    }

    describe('when a function is passed into zEmbed', () => {
      const zEFunctionSpy = jest.fn()

      beforeEach(() => {
        fireSetup().zEmbed(zEFunctionSpy)
      })

      it('calls the function passed in', () => {
        expect(zEFunctionSpy).toHaveBeenCalled()
      })
    })

    describe('when a string is passed into zEmbed', () => {
      beforeEach(() => {
        fireSetup().zEmbed('webWidget', 'hide')
      })

      it('handles the api call', () => {
        expect(apis.hideApi).toHaveBeenCalled()
      })
    })

    describe('when win.zE and win.zEmbed are the same upon override', () => {
      let win

      beforeEach(() => {
        const embedState = { t: 'hello fren' }

        win = fireSetup({
          zEmbed: embedState,
          zE: embedState
        })
      })

      it('expects them to be the same reference upon resolution of override', () => {
        expect(win.zE).toEqual(win.zEmbed)
      })

      it('expects their properties to match', () => {
        expect(win.zE.t).toEqual(win.zEmbed.t)
      })
    })

    describe('when win.zE and win.zEmbed are different upon override', () => {
      let win

      beforeEach(() => {
        win = fireSetup({
          zEmbed: {
            t: 'hello fren'
          },
          zE: {
            t: 'hello fren'
          }
        })
      })

      it('expects them to be different upon resolution of override', () => {
        expect(win.zE).not.toEqual(win.zEmbed)
      })

      it('expects their properties to match', () => {
        expect(win.zE.t).toEqual(win.zEmbed.t)
      })
    })

    it('does not strip existing properties', () => {
      expect(fireSetup().zEmbed.t).toEqual('hello fren')
    })
  })
})

describe('pre render methods', () => {
  const enqueue = call => {
    api.apisExecuteQueue(mockStore, [call])
    api.apisExecutePostRenderQueue({}, [], mockStore)
  }

  describe('when that call is hide', () => {
    beforeEach(() => {
      const call = ['webWidget', 'hide']

      enqueue(call)
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
      const call = ['webWidget', 'show']

      enqueue(call)
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
      const call = ['webWidget', 'open']

      enqueue(call)
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
      const call = ['webWidget', 'close']

      enqueue(call)
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
      const call = ['webWidget', 'toggle']

      enqueue(call)
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
      enqueue(['webWidget', 'setLocale', 'fr'])
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
      enqueue(['webWidget', 'clear'])
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
        enqueue(['webWidget', 'reset'])
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
        enqueue(['webWidget', 'reset'])
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
        enqueue(['webWidget', 'identify', user])
      })

      it('calls mediator onIdentify with the user', () => {
        expect(apis.identifyApi).toHaveBeenCalledWith(mockStore, user)
      })
    })

    describe('when that call is prefill', () => {
      const payload = {
        name: { value: 'Terence', readOnly: true },
        email: { value: 'a2b.c' }
      }

      beforeEach(() => {
        enqueue(['webWidget', 'prefill', payload])
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
        enqueue(['webWidget', 'updateSettings', settings])
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
        enqueue(['webWidget', 'logout'])
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
        enqueue(['webWidget', 'helpCenter:setSuggestions', options])
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
        enqueue(['webWidget', 'updatePath', options])
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
        enqueue(['webWidget:get', 'chat:isChatting'])
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
  let win = { zEmbed: {} }

  const callAfterRender = call => {
    api.setupLegacyApiQueue(win, [], mockStore)
    result = win.zEmbed(...call)
  }

  describe('when that call is hide', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'hide'])
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
      callAfterRender(['webWidget', 'show'])
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
      callAfterRender(['webWidget', 'open'])
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
      callAfterRender(['webWidget', 'close'])
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
      callAfterRender(['webWidget', 'toggle'])
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
        callAfterRender(['webWidget', 'reset'])
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
        callAfterRender(['webWidget', 'reset'])
        expect(apiResetWidget).not.toHaveBeenCalled()
        spy.mockRestore()
      })
    })
  })

  describe('when that call is setLocale', () => {
    beforeEach(() => {
      callAfterRender(['webWidget', 'setLocale', 'fr'])
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
      callAfterRender(['webWidget', 'identify', user])
    })

    it('calls mediator onIdentify with the user', () => {
      expect(apis.identifyApi).toHaveBeenCalledWith(mockStore, user)
    })
  })

  describe('when that call is prefill', () => {
    const payload = {
      name: { value: 'T-bone', readOnly: true },
      email: { value: 'a2b.c' }
    }

    beforeEach(() => {
      callAfterRender(['webWidget', 'prefill', payload])
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
      callAfterRender(['webWidget', 'updateSettings', settings])
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
      callAfterRender(['webWidget', 'logout'])
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
      callAfterRender(['webWidget', 'helpCenter:setSuggestions', options])
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
      callAfterRender(['webWidget', 'updatePath', options])
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
      callAfterRender(['webWidget', 'chat:end'])
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
      callAfterRender(['webWidget', 'chat:send'])
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
      callAfterRender(['webWidget:on', 'close', () => {}])
    })

    it('tracks the call', () => {
      expect(tracker.track).toHaveBeenCalledWith('webWidget:on.close', expect.any(Function))
    })
  })

  describe('when that call is get', () => {
    describe('when the param is part of the allowList', () => {
      beforeEach(() => {
        apis.isChattingApi.mockReturnValue('1234')
        callAfterRender(['webWidget:get', `chat:${API_GET_IS_CHATTING_NAME}`])
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

    describe('when the param is not part of the allowList', () => {
      beforeEach(() => {
        callAfterRender(['webWidget:get', 'something else'])
      })

      it('returns undefined', () => {
        expect(result).toBe(undefined)
      })
    })
  })

  describe('when that call is a non-existent method', () => {
    it('throws an error', () => {
      expect(() => {
        apiExecute(apiStructurePostRenderSetup(), mockStore, ['webWidget:dude', 'blob', () => {}])
      }).toThrow('Method webWidget.dude.blob does not exist')
    })
  })
})

describe('legacy apis', () => {
  let win = { zE: {} }
  const user = {
    name: 'Jane Doe',
    email: 'a@b.c'
  }

  beforeEach(() => {
    api.legacyApiSetup(win, mockStore)
  })

  describe('zE.show', () => {
    describe('when widget already shown', () => {
      beforeEach(() => {
        jest.spyOn(baseSelectors, 'getWidgetAlreadyHidden').mockReturnValue(true)
        legacyShowReceived.mockReturnValue({ type: 'show' })
        win.zE.show()
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
        win.zE.show()
      })

      it('calls tracker on win.zE', () => {
        expect(legacyShowReceived).not.toHaveBeenCalled()
        expect(mockStore.dispatch).not.toHaveBeenCalledWith()
      })
    })
  })

  describe('zE.identify', () => {
    beforeEach(() => {
      win.zE.identify(user)
    })

    it('calls tracker on win.zE', () => {
      expect(tracker.addTo).toHaveBeenCalledWith(win.zE, 'zE')
    })

    it('calls handlePrefillReceived with the formatted user object', () => {
      const expected = {
        name: { value: 'Jane Doe' },
        email: { value: 'a@b.c' }
      }

      expect(apis.prefill).toHaveBeenCalledWith(mockStore, expected)
    })
  })
})
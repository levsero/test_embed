import * as callbacks from '../callbacks'

beforeEach(() => {
  callbacks.reset()
})

describe('user calls zopim api', () => {
  describe('when chat has initialized already', () => {
    beforeEach(() => {
      callbacks.handleChatSDKInitialized()
    })

    it('executes the callback immediately', () => {
      const callbackSpy = jest.fn()

      expect(callbackSpy).not.toHaveBeenCalled()
      callbacks.onChatSDKInitialized(callbackSpy)
      expect(callbackSpy).toHaveBeenCalled()
    })
  })

  describe('when chat has not initialized', () => {
    it('does not execute callback immediately', () => {
      const callbackSpy = jest.fn()

      callbacks.onChatSDKInitialized(callbackSpy)
      expect(callbackSpy).not.toHaveBeenCalled()
    })

    describe('when chat initializes', () => {
      const callbackSpies = [jest.fn(), jest.fn()]

      beforeEach(() => {
        callbackSpies.forEach(callbackSpy => {
          callbacks.onChatSDKInitialized(callbackSpy)
        })

        callbacks.handleChatSDKInitialized()
      })

      it('executes stored callback', () => {
        callbackSpies.forEach(callbackSpy => {
          expect(callbackSpy).toHaveBeenCalled()
        })
      })
    })
  })

  describe('when chat has connected already', () => {
    beforeEach(() => {
      callbacks.handleChatConnected()
    })

    it('executes the callback immediately', () => {
      const callbackSpy = jest.fn()

      expect(callbackSpy).not.toHaveBeenCalled()
      callbacks.onChatConnected(callbackSpy)
      expect(callbackSpy).toHaveBeenCalled()
    })
  })

  describe('when chat has not connected', () => {
    it('does not execute callback immediately', () => {
      const callbackSpy = jest.fn()

      callbacks.onChatConnected(callbackSpy)
      expect(callbackSpy).not.toHaveBeenCalled()
    })

    describe('when chat connects', () => {
      const callbackSpies = [jest.fn(), jest.fn()]

      beforeEach(() => {
        callbackSpies.forEach(callbackSpy => {
          callbacks.onChatConnected(callbackSpy)
        })

        callbacks.handleChatConnected()
      })

      it('execute stored callbacks', () => {
        callbackSpies.forEach(callbackSpy => {
          expect(callbackSpy).toHaveBeenCalled()
        })
      })
    })
  })
})

import { waitFor } from '@testing-library/dom'
import { logger } from '@zendesk/widget-shared-services'
import * as suncoApi from 'messengerSrc/api/sunco'
import * as conversationStore from 'messengerSrc/features/suncoConversation/store'
import createStore from 'messengerSrc/store'
import * as actions from '../actions'
import * as authentication from '../authentication'

describe('integration store', () => {
  describe('loginUser', () => {
    let getJWTFn

    beforeEach(() => {
      getJWTFn = jest.fn(() => 'mockJwt')
    })

    describe('when successfully logged in', () => {
      it('starts a new conversation if the user does not already have one', async () => {
        jest.spyOn(suncoApi, 'loginUser').mockImplementation(async () => {})
        jest.spyOn(suncoApi, 'hasExistingAppUser').mockImplementation(() => true)
        jest.spyOn(suncoApi, 'hasExistingConversation').mockImplementation(() => true)
        jest.spyOn(conversationStore, 'startConversation')

        const store = createStore()
        store.dispatch(authentication.loginUser(getJWTFn))

        expect(suncoApi.loginUser).toHaveBeenCalledWith(getJWTFn)
        await waitFor(() => expect(conversationStore.startConversation).toHaveBeenCalledTimes(1))
      })
      it('does not start a new conversation if the user has an existing conversation', async () => {
        jest.spyOn(suncoApi, 'loginUser').mockImplementation(async () => {})
        jest.spyOn(suncoApi, 'hasExistingAppUser').mockImplementation(() => false)
        jest.spyOn(conversationStore, 'startConversation')

        const store = createStore()
        store.dispatch(authentication.loginUser(getJWTFn))

        expect(suncoApi.loginUser).toHaveBeenCalledWith(getJWTFn)
        await waitFor(() => expect(conversationStore.startConversation).not.toHaveBeenCalled())
      })
      it('logs the old user out when external id changes', async () => {
        jest.spyOn(suncoApi, 'loginUser').mockImplementation(async () => {
          return { hasExternalIdChanged: true }
        })
        jest.spyOn(actions, 'userLoggedOut')

        const store = createStore()
        store.dispatch(authentication.loginUser(getJWTFn))

        await expect(suncoApi.loginUser).toHaveBeenCalledWith(getJWTFn)
        expect(actions.userLoggedOut).toHaveBeenCalledTimes(1)
      })

      it('does not log the old user out when external id does not change', async () => {
        jest.spyOn(suncoApi, 'loginUser').mockImplementation(async () => {
          return { hasExternalIdChanged: false }
        })
        jest.spyOn(actions, 'userLoggedOut')

        const store = createStore()
        store.dispatch(authentication.loginUser(getJWTFn))

        expect(suncoApi.loginUser).toHaveBeenCalledWith(getJWTFn)
        await waitFor(() => expect(actions.userLoggedOut).not.toHaveBeenCalled())
      })
    })
    describe('when failed to log in', () => {
      it('logs an error', async () => {
        const mockError = new Error('Network error')
        logger.devLog = jest.fn()
        jest.spyOn(actions, 'userLoggedOut')
        jest.spyOn(authentication, 'loginUser')
        jest.spyOn(suncoApi, 'loginUser').mockImplementation(async () => {
          throw mockError
        })

        const store = createStore()
        store.dispatch(authentication.loginUser(getJWTFn))

        expect(suncoApi.loginUser).toHaveBeenCalledWith(getJWTFn)
        await waitFor(() => {
          expect(logger.devLog).toHaveBeenCalledWith('Unable to login user', mockError)
          expect(actions.userLoggedOut).toHaveBeenCalledTimes(1)
        })
      })
    })
  })

  describe('logoutUser', () => {
    describe('when successfully logged out', () => {
      it('dispatches userLoggedOut action', async () => {
        jest.spyOn(actions, 'userLoggedOut')
        jest.spyOn(suncoApi, 'logoutUser').mockImplementation(async () => {})

        const store = createStore()
        store.dispatch(authentication.logoutUser())

        expect(suncoApi.logoutUser).toHaveBeenCalledTimes(1)
        await waitFor(() => expect(actions.userLoggedOut).toHaveBeenCalledTimes(1))
      })
    })
    describe('when failed to log out', () => {
      it('logs an error', async () => {
        const mockError = new Error('Network error')
        logger.devLog = jest.fn()
        jest.spyOn(actions, 'userLoggedOut')
        jest.spyOn(suncoApi, 'logoutUser').mockImplementation(async () => {
          throw mockError
        })

        const store = createStore()
        store.dispatch(authentication.logoutUser())

        expect(suncoApi.logoutUser).toHaveBeenCalledTimes(1)
        await waitFor(() => {
          expect(logger.devLog).toHaveBeenCalledWith('Unable to logout user', mockError)
          expect(actions.userLoggedOut).toHaveBeenCalledTimes(1)
        })
      })
    })
  })
})

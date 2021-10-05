import { waitFor } from '@testing-library/dom'
import * as suncoApi from 'src/apps/messenger/api/sunco'
import createStore from 'src/apps/messenger/store/index'
import { fetchIntegrations, selectIntegrationById } from 'src/apps/messenger/store/integrations'
import { createMockStore } from 'src/util/testHelpers'
import {
  startConversation,
  reducer,
  getConversationStatus,
  messageReceived,
  fileUploadMessageReceived,
} from '../store'

jest.mock('src/apps/messenger/api/sunco')

describe('suncoConversation Store', () => {
  describe('message events', () => {
    let listeners
    let mockWasMessageSentFromThisTab

    beforeEach(() => {
      listeners = {}
      mockWasMessageSentFromThisTab = jest.fn()
      jest.spyOn(suncoApi, 'getActiveConversation').mockImplementation(async () => ({
        socketClient: {
          on: (eventType, callback) => {
            listeners[eventType] = callback
          },
        },
      }))
      jest.spyOn(suncoApi, 'getClient').mockImplementation(() => ({
        wasMessageSentFromThisTab: mockWasMessageSentFromThisTab,
      }))
    })

    it('dispatches messageReceived for each message', async () => {
      const store = createMockStore()

      const message = { type: 'text', _id: '123' }

      store.dispatch(startConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['message'](message)

      expect(store.getActions()).toEqual(expect.arrayContaining([messageReceived({ message })]))
    })

    it('ignores messages sent from same browser tab', async () => {
      const store = createMockStore()
      mockWasMessageSentFromThisTab.mockReturnValue(true)

      const message = { type: 'text', _id: '123' }

      store.dispatch(startConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['message'](message)

      expect(store.getActions()).not.toEqual(expect.arrayContaining([messageReceived({ message })]))
    })

    it('dispatches fileUploadMessageReceived for files sent from same browser tab', async () => {
      const store = createMockStore()
      mockWasMessageSentFromThisTab.mockReturnValue(true)

      const message = { type: 'file', _id: '123' }

      store.dispatch(startConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['message'](message)

      expect(store.getActions()).toEqual(
        expect.arrayContaining([fileUploadMessageReceived({ message })])
      )
    })

    it('dispatches fileUploadMessageReceived for images sent from same browser tab', async () => {
      const store = createMockStore()
      mockWasMessageSentFromThisTab.mockReturnValue(true)

      const message = { type: 'image', _id: '123' }

      store.dispatch(startConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['message'](message)

      expect(store.getActions()).toEqual(
        expect.arrayContaining([fileUploadMessageReceived({ message })])
      )
    })
  })

  describe('linkEvent', () => {
    let listeners

    beforeEach(() => {
      listeners = {}
      jest.spyOn(suncoApi, 'getActiveConversation').mockImplementation(async () => ({
        socketClient: {
          on: (eventType, callback) => {
            listeners[eventType] = callback
          },
        },
      }))
    })

    it('calls updateSession on link event', async () => {
      const store = createStore()

      store.dispatch(startConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'link', appUser: {}, client: { platform: 'messenger' } })

      expect(suncoApi.updateSession).toHaveBeenCalledWith({})
    })

    it('does not call the link callback on another type of event', async () => {
      const store = createStore()

      store.dispatch(startConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'unlink', appUser: {} })

      expect(suncoApi.updateSession).not.toHaveBeenCalled()
    })

    it('marks the integration as linked', async () => {
      const store = createStore()

      store.dispatch({
        type: fetchIntegrations.fulfilled.toString(),
        payload: [{ pageId: '12345678', appId: '23456789', _id: '0c19f2c2c28', type: 'messenger' }],
      })

      expect(selectIntegrationById(store.getState(), 'messenger').linked).toBe(false)

      store.dispatch(startConversation())
      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'link', appUser: {}, client: { platform: 'messenger' } })

      expect(selectIntegrationById(store.getState(), 'messenger').linked).toBe(true)
    })

    it('set linkCancelled status to true on link:cancelled event', async () => {
      const store = createStore()

      store.dispatch({
        type: fetchIntegrations.fulfilled.toString(),
        payload: [{ pageId: '12345678', appId: '23456789', _id: '0c19f2c2c28', type: 'messenger' }],
      })

      expect(selectIntegrationById(store.getState(), 'messenger').linkCancelled).toBe(false)

      store.dispatch(startConversation())
      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'link:cancelled', appUser: {}, client: { platform: 'messenger' } })

      expect(selectIntegrationById(store.getState(), 'messenger').linkCancelled).toBe(true)
    })

    it('set linkFailed status to true on link:failed event', async () => {
      const store = createStore()

      store.dispatch({
        type: fetchIntegrations.fulfilled.toString(),
        payload: [{ pageId: '12345678', appId: '23456789', _id: '0c19f2c2c28', type: 'messenger' }],
      })

      expect(selectIntegrationById(store.getState(), 'messenger').linkFailed).toBe(false)

      store.dispatch(startConversation())
      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'link:failed', appUser: {}, client: { platform: 'messenger' } })

      expect(selectIntegrationById(store.getState(), 'messenger').linkFailed).toBe(true)
    })

    describe('event is a link:matched event', () => {
      it('puts the channel in a pending state', async () => {
        const store = createStore()

        store.dispatch({
          type: fetchIntegrations.fulfilled.toString(),
          payload: [
            { pageId: '12345678', appId: '23456789', _id: '0c19f2c2c28', type: 'messenger' },
          ],
        })

        expect(selectIntegrationById(store.getState(), 'messenger').linkPending).toBe(false)

        store.dispatch(startConversation())
        await waitFor(() => expect(listeners['connected']).toBeTruthy())
        listeners['connected']()
        listeners['link']({ type: 'link:matched', appUser: {}, client: { platform: 'messenger' } })

        expect(selectIntegrationById(store.getState(), 'messenger').linkPending).toBe(true)
      })
    })
  })
})

describe('conversation state', () => {
  it('defaults to not-connected', () => {
    const result = reducer(undefined, { type: 'some-action' })
    expect(result).toEqual({ status: 'not-connected' })
  })

  it('is pending when a conversation begins connecting', () => {
    const result = reducer(undefined, startConversation.pending())
    expect(result).toEqual({ status: 'pending' })
  })
  it('is connection when a conversation successfully starts', () => {
    const result = reducer(undefined, startConversation.fulfilled())
    expect(result).toEqual({ status: 'connected' })
  })
  it('is failed when a conversation fails to start', () => {
    const result = reducer(undefined, startConversation.rejected())
    expect(result).toEqual({ status: 'failed' })
  })

  describe('getConversationStatus', () => {
    it('returns the status of the conversation', () => {
      expect(getConversationStatus({ conversation: { status: 'some-fancy-status' } })).toBe(
        'some-fancy-status'
      )
    })
  })
})

import { waitFor } from '@testing-library/dom'
import * as suncoApi from 'src/apps/messenger/api/sunco'
import createStore from 'src/apps/messenger/store/index'
import { fetchIntegrations, selectIntegrationById } from 'src/apps/messenger/store/integrations'
import { startNewConversation } from '../store'

jest.mock('src/apps/messenger/api/sunco')

describe('suncoConversation Store', () => {
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

      store.dispatch(startNewConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'link', appUser: {}, client: { platform: 'messenger' } })

      expect(suncoApi.updateSession).toHaveBeenCalledWith({})
    })

    it('does not call the link callback on another type of event', async () => {
      const store = createStore()

      store.dispatch(startNewConversation())

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

      store.dispatch(startNewConversation())
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

      store.dispatch(startNewConversation())
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

      store.dispatch(startNewConversation())
      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'link:failed', appUser: {}, client: { platform: 'messenger' } })

      expect(selectIntegrationById(store.getState(), 'messenger').linkFailed).toBe(true)
    })
  })
})

import { waitFor } from '@testing-library/dom'
import * as suncoApi from 'src/apps/messenger/api/sunco'
import createStore from 'src/apps/messenger/store/index'
import { startNewConversation } from '../store'

jest.mock('src/apps/messenger/api/sunco')

describe('suncoConversation Store', () => {
  const listeners = {}
  const mockConversation = {
    socketClient: {
      on: (eventType, callback) => {
        listeners[eventType] = callback
      },
    },
  }

  describe('linkEvent', () => {
    it('calls updateSession on link event', async () => {
      const store = createStore()
      jest.spyOn(suncoApi, 'getActiveConversation').mockImplementation(async () => mockConversation)

      store.dispatch(startNewConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'link', appUser: {} })

      expect(suncoApi.updateSession).toHaveBeenCalledWith({})
    })

    it('does not call the link callback on another type of event', async () => {
      const store = createStore()
      jest.spyOn(suncoApi, 'getActiveConversation').mockImplementation(async () => mockConversation)

      store.dispatch(startNewConversation())

      await waitFor(() => expect(listeners['connected']).toBeTruthy())
      listeners['connected']()
      listeners['link']({ type: 'unlink', appUser: {} })

      expect(suncoApi.updateSession).not.toHaveBeenCalled()
    })
  })
})

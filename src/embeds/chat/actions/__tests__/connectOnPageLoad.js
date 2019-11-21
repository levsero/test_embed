import { updateDeferredChatData } from '../connectOnPageLoad'
import { UPDATE_DEFERRED_CHAT_ONLINE_STATUS } from 'embeds/chat/actions/action-types'

describe('chat embed actions', () => {
  describe('updateDeferredChatOnlineStatus', () => {
    it(`returns a redux action for ${UPDATE_DEFERRED_CHAT_ONLINE_STATUS} with the provided status and departments`, () => {
      expect(
        updateDeferredChatData('online', {
          123: { id: 123, name: 'Some department', status: 'online' }
        })
      ).toEqual({
        type: UPDATE_DEFERRED_CHAT_ONLINE_STATUS,
        payload: {
          status: 'online',
          departments: {
            123: {
              id: 123,
              name: 'Some department',
              status: 'online'
            }
          }
        }
      })
    })
  })
})

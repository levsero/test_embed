import { mockZChatVendor, initialState, createMockStore } from 'utility/testHelpers'
import { CONNECTION_STATUSES } from 'constants/chat'
import * as actions from '../settings-actions'
import * as actionTypes from '../settings-action-types'
import { settings as legacySettings } from 'service/settings'

describe('updateSettings', () => {
  describe('when chat jwtFn provided', () => {
    test('store chat jwtFn', () => {
      const jwtFn = jest.fn()
      const storeChatAuth = jest.fn()
      const store = createMockStore()
      jest.spyOn(legacySettings, 'storeChatAuth').mockImplementation(storeChatAuth)

      store.dispatch(
        actions.updateSettings({
          webWidget: {
            authenticate: {
              chat: { jwtFn }
            },
            chat: {
              suppress: true
            }
          }
        })
      )

      expect(storeChatAuth).toHaveBeenCalledWith(jwtFn)
    })
  })

  describe('when chat jwtFn not provided', () => {
    test('does not store chat jwtFn', () => {
      const storeChatAuth = jest.fn()
      const store = createMockStore()
      jest.spyOn(legacySettings, 'storeChatAuth').mockImplementation(storeChatAuth)

      store.dispatch(
        actions.updateSettings({
          webWidget: {
            chat: {
              suppress: true
            }
          }
        })
      )

      expect(storeChatAuth).not.toHaveBeenCalled()
    })
  })

  test('wraps settings appropriately if not already wrapped', () => {
    const store = createMockStore()
    store.dispatch(actions.updateSettings({ chat: { suppress: true } }))
    expect(store.getActions()[0]).toEqual({
      type: actionTypes.UPDATE_SETTINGS,
      payload: {
        webWidget: {
          chat: {
            suppress: true
          }
        }
      }
    })
  })

  test('updates chat settings when chat is connected', () => {
    const zChat = mockZChatVendor({
      setVisitorDefaultDepartment: jest.fn()
    })
    const state = initialState()
    state.chat.connection = CONNECTION_STATUSES.CONNECTED
    state.chat.departments = {
      '1': { id: '1', name: 'one' },
      '2': { id: '2', name: 'two' }
    }
    state.settings.chat.departments.select = 'two'

    const store = createMockStore(state)
    store.dispatch(actions.updateSettings())
    expect(zChat.setVisitorDefaultDepartment).toHaveBeenCalledWith('2', expect.anything())
  })
})

describe('updateChatSettings', () => {
  describe('setVisitorDefaultDepartment', () => {
    it('calls zChat when department is selected in settings', () => {
      const zChat = mockZChatVendor({
        setVisitorDefaultDepartment: jest.fn()
      })
      const state = initialState()
      state.chat.departments = {
        '1': { id: '1', name: 'one' },
        '2': { id: '2', name: 'two' }
      }
      state.settings.chat.departments.select = 'two'
      const store = createMockStore(state)
      store.dispatch(actions.updateChatSettings())
      expect(zChat.setVisitorDefaultDepartment).toHaveBeenCalledWith('2', expect.anything())
    })
  })

  describe('chat tags', () => {
    it('updates chat tags when the tags change', () => {
      const zChat = mockZChatVendor({
        addTags: jest.fn(),
        removeTags: jest.fn()
      })
      const state = initialState()
      state.settings.chat.tags = ['two', 'three']
      const store = createMockStore(state)
      store.dispatch(actions.updateChatSettings(['one', 'four']))
      expect(zChat.removeTags).toHaveBeenCalledWith(['one', 'four'])
      expect(zChat.addTags).toHaveBeenCalledWith(['two', 'three'])
    })

    it('only removes and adds what was changed', () => {
      const zChat = mockZChatVendor({
        addTags: jest.fn(),
        removeTags: jest.fn()
      })
      const state = initialState()
      state.settings.chat.tags = ['two', 'three']
      const store = createMockStore(state)
      store.dispatch(actions.updateChatSettings(['two', 'four']))
      expect(zChat.removeTags).toHaveBeenCalledWith(['four'])
      expect(zChat.addTags).toHaveBeenCalledWith(['three'])
    })
  })
})

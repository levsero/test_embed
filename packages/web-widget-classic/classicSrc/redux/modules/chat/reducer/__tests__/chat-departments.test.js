import { RECEIVE_DEFERRED_CHAT_STATUS } from 'classicSrc/embeds/chat/actions/action-types'
import { SDK_DEPARTMENT_UPDATE } from 'classicSrc/redux/modules/chat/chat-action-types'
import reducer from './../chat-departments'

describe('chat reducer departments', () => {
  const initialState = reducer(undefined, { type: '' })

  describe('initial state', () => {
    it('is set to an empty object', () => {
      expect(initialState).toEqual({})
    })
  })

  describe('when a SDK_DEPARTMENT_UPDATE action is dispatched', () => {
    const payload = {
      detail: {
        id: 123,
        name: 'Helpdesk',
        status: 'online',
      },
    }

    it('adds the department with the payload data if not already in state', () => {
      const newState = reducer(undefined, {
        type: SDK_DEPARTMENT_UPDATE,
        payload: {
          detail: { ...payload.detail, id: 123 },
        },
      })

      expect(newState[payload.detail.id]).toEqual(payload.detail)
    })

    it('updates the department with the payload data if already exists', () => {
      const withOnlineDepartment = reducer(undefined, {
        type: SDK_DEPARTMENT_UPDATE,
        payload: {
          detail: { ...payload.detail, status: 'online' },
        },
      })

      const withOfflineDepartment = reducer(withOnlineDepartment, {
        type: SDK_DEPARTMENT_UPDATE,
        payload: {
          detail: { ...payload.detail, status: 'offline' },
        },
      })

      expect(withOfflineDepartment[payload.detail.id].status).toEqual('offline')
    })
  })

  describe('when RECEIVE_DEFERRED_CHAT_STATUS is dispatched', () => {
    it("updates all departments' status", () => {
      const previousState = {
        123: {
          id: 123,
          name: 'One',
          status: 'online',
        },
      }

      const state = reducer(previousState, {
        type: RECEIVE_DEFERRED_CHAT_STATUS,
        payload: {
          status: 'online',
          departments: {
            123: {
              id: 123,
              name: 'One',
              status: 'offline',
            },
            456: {
              id: 456,
              name: 'Two',
              status: 'online',
            },
          },
        },
      })

      expect(state).toEqual({
        123: {
          id: 123,
          name: 'One',
          status: 'offline',
        },
        456: {
          id: 456,
          name: 'Two',
          status: 'online',
        },
      })
    })
  })
})

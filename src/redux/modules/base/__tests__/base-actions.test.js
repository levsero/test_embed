import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from 'src/redux/modules/base/base-actions'
import * as actionTypes from 'src/redux/modules/base/base-action-types'
import * as reselectors from 'src/redux/modules/chat/chat-selectors/reselectors'
import { UPDATE_CHAT_SCREEN } from 'src/redux/modules/chat/chat-action-types'

const mockState = {
  chat: {
    accountSettings: {
      prechatForm: false
    }
  }
}

const mockStore = configureMockStore([thunk])

const dispatchAction = action => {
  const store = mockStore(mockState)

  store.dispatch(action)

  return store.getActions()
}

describe('apiResetWidget', () => {
  describe('when the prechat form is required', () => {
    beforeEach(() => {
      jest.spyOn(reselectors, 'getPrechatFormRequired').mockReturnValueOnce(false)
    })

    it('dispatches an action of type API_CLEAR_FORM First', () => {
      const actionList = dispatchAction(actions.apiResetWidget())

      expect(actionList[0].type).toEqual(actionTypes.API_CLEAR_FORM)
    })

    it('dispatches an action of type API_CLEAR_HC_SEARCHES Second', () => {
      const actionList = dispatchAction(actions.apiResetWidget())

      expect(actionList[1].type).toEqual(actionTypes.API_CLEAR_HC_SEARCHES)
    })

    it('dispatches an action of type API_RESET_WIDGET Third', () => {
      const actionList = dispatchAction(actions.apiResetWidget())

      expect(actionList[2].type).toEqual(actionTypes.API_RESET_WIDGET)
    })

    it('does not dispatch an action of type UPDATE_CHAT_SCREEN', () => {
      const actionList = dispatchAction(actions.apiResetWidget())

      expect(actionList[3]).toBeUndefined()
    })
  })

  describe('when the prechat form is required', () => {
    beforeEach(() => {
      jest.spyOn(reselectors, 'getPrechatFormRequired').mockReturnValueOnce(true)
    })

    it('dispatches an action of type UPDATE_CHAT_SCREEN', () => {
      const actionList = dispatchAction(actions.apiResetWidget())

      expect(actionList[3].type).toEqual(UPDATE_CHAT_SCREEN)
    })
  })
})

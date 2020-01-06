import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actions from 'src/redux/modules/base/base-actions'
import * as actionTypes from 'src/redux/modules/base/base-action-types'
import * as reselectors from 'src/redux/modules/chat/chat-selectors/reselectors'
import * as selectors from 'src/redux/modules/base/base-selectors'
import * as callbacks from 'service/api/callbacks'
import { UPDATE_CHAT_SCREEN } from 'src/redux/modules/chat/chat-action-types'
import { ATTACHMENTS_CLEARED } from 'src/embeds/support/actions/action-types'
import { WIDGET_CLOSED_EVENT, WIDGET_OPENED_EVENT } from 'constants/event'

jest.mock('service/api/callbacks')

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

    it('dispatches an action of type API_RESET_WIDGET Second', () => {
      const actionList = dispatchAction(actions.apiResetWidget())

      expect(actionList[1].type).toEqual(ATTACHMENTS_CLEARED)
    })

    it('dispatches an action of type API_RESET_WIDGET Third', () => {
      const actionList = dispatchAction(actions.apiResetWidget())

      expect(actionList[2].type).toEqual(actionTypes.API_RESET_WIDGET)
    })

    it('does not dispatch an action of type UPDATE_CHAT_SCREEN', () => {
      const actionList = dispatchAction(actions.apiResetWidget())

      expect(actionList[4]).toBeUndefined()
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

describe('handleEscapeKeyPressed', () => {
  describe('when the web widget is open', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getWebWidgetVisible').mockReturnValue(true)
    })

    it('dispatches an action of type ESCAPE_KEY_PRESSED', () => {
      const actionList = dispatchAction(actions.handleEscapeKeyPressed())

      expect(actionList[0].type).toEqual(actionTypes.ESCAPE_KEY_PRESSED)
    })

    it('calls callbacks.fireFor for widget closed', () => {
      dispatchAction(actions.handleEscapeKeyPressed())

      expect(callbacks.fireFor).toHaveBeenCalledWith(WIDGET_CLOSED_EVENT)
    })
  })

  describe('when the web widget is not open', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getWebWidgetVisible').mockReturnValue(false)
    })

    it('does not dispatch an action of type ESCAPE_KEY_PRESSED', () => {
      const actionList = dispatchAction(actions.handleEscapeKeyPressed())

      expect(actionList[0]).toBeUndefined()
    })

    it('does not call callbacks.fireFor', () => {
      dispatchAction(actions.handleEscapeKeyPressed())

      expect(callbacks.fireFor).not.toHaveBeenCalledWith()
    })
  })
})

describe('apiClearForm', () => {
  it('dispatches API_CLEAR_FORM and ATTACHMENTS_CLEARED actions', () => {
    const dispatchedActions = dispatchAction(actions.apiClearForm())

    expect(dispatchedActions).toEqual([
      { type: actionTypes.API_CLEAR_FORM },
      { type: ATTACHMENTS_CLEARED }
    ])
  })
})

describe('toggleReceived', () => {
  beforeEach(() => {
    jest.spyOn(selectors, 'getWebWidgetVisible').mockReturnValue(true)
  })

  it('dispatches a TOGGLE_RECEIVED action', () => {
    const dispatchedActions = dispatchAction(actions.toggleReceived())

    expect(dispatchedActions).toEqual([{ type: actionTypes.TOGGLE_RECEIVED }])
  })

  describe('when the widget is closed before calling toggle', () => {
    it('fires the callback queue for a WIDGET_OPENED_EVENT', () => {
      dispatchAction(actions.toggleReceived())

      expect(callbacks.fireFor).toHaveBeenCalledWith(WIDGET_OPENED_EVENT)
    })
  })

  describe('when the widget is open before calling toggle', () => {
    beforeEach(() => {
      jest.spyOn(selectors, 'getWebWidgetVisible').mockReturnValue(false)
    })

    it('fires the callback queue for a WIDGET_CLOSED_EVENT', () => {
      dispatchAction(actions.toggleReceived())

      expect(callbacks.fireFor).toHaveBeenCalledWith(WIDGET_CLOSED_EVENT)
    })
  })
})

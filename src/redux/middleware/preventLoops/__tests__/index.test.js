import errorTracker from 'service/errorTracker'
import { beacon } from 'service/beacon'
const preventLoops = jest.requireActual('../').default

jest.mock('service/errorTracker', () => ({
  error: jest.fn()
}))
jest.mock('service/beacon', () => ({
  beacon: {
    trackUserAction: jest.fn()
  }
}))
import {
  SDK_CHAT_MSG,
  CHAT_BOX_CHANGED,
  SDK_HISTORY_CHAT_MSG
} from 'src/redux/modules/chat/chat-action-types'

const getAction = (actionType = 'fake_action') => {
  return {
    type: actionType
  }
}

describe('preventLoops', () => {
  describe('with fewer than 100 actions', () => {
    beforeEach(() => {
      Array.from({ length: 90 }).forEach(() => {
        preventLoops({ getState: noop })(jest.fn())(getAction())
      })
    })

    it('does not log the action', () => {
      expect(errorTracker.error).not.toHaveBeenCalled()
      expect(beacon.trackUserAction).not.toHaveBeenCalled()
    })
  })

  describe('with a total of more than 100 actions calls', () => {
    beforeEach(() => {
      Array.from({ length: 30 }).forEach(() => {
        preventLoops({ getState: noop })(jest.fn())(getAction())
      })
    })

    it('calls the logger a single time', () => {
      expect(errorTracker.error).toHaveBeenCalledTimes(1)
      expect(beacon.trackUserAction).toHaveBeenCalledTimes(1)
    })
  })

  describe('it ignores certain actions', () => {
    beforeEach(() => {
      const actionsToSkip = [SDK_HISTORY_CHAT_MSG, SDK_CHAT_MSG, CHAT_BOX_CHANGED]

      actionsToSkip.forEach(actionName => {
        preventLoops({ getState: noop })(jest.fn())(getAction(actionName))
      })
    })

    it('does not call the logger for any action', () => {
      expect(errorTracker.error).not.toHaveBeenCalled()
      expect(beacon.trackUserAction).not.toHaveBeenCalled()
    })
  })
})

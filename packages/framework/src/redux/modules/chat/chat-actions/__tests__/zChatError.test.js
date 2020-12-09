import { setUpChat } from '../setUpChat'

import { getModifiedState } from 'src/fixtures/selectors-test-state'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from 'src/redux/modules/chat/chat-actions/actions'
import * as zChat from 'chat-web-sdk'

const dispatchAction = (customState = {}) => {
  const mockStore = configureMockStore([thunk])
  const store = mockStore(getModifiedState(customState))

  store.dispatch(setUpChat())

  return store
}

describe('on zChat error', () => {
  beforeAll(() => {
    dispatchAction({ chat: { vendor: { zChat } } })
  })

  describe('when not a user ban', () => {
    it('fires a console warning with the error', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      zChat.fire('error', new Error('big ol bug found'))
      // eslint-disable-next-line no-console
      expect(console.warn).toHaveBeenCalledWith('big ol bug found')
    })
  })

  describe('when user has been banned', () => {
    it('dispatches chatBanned action', () => {
      jest.spyOn(console, 'warn').mockImplementation(() => {})
      jest.spyOn(actions, 'chatBanned')
      zChat.fire('error', new Error('Visitor has been banned'))
      expect(actions.chatBanned).toHaveBeenCalled()
    })
  })
})

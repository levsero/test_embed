import * as actions from '../conversation-scroll-changed'

test('conversationScrollChanged dispatches expected payload', () => {
  expect(actions.conversationScrollChanged(21)).toMatchSnapshot()
})

import * as actions from '../conversation-screen-closed';

test('conversationScreenClosed dispatches expected payload', () => {
  jest.spyOn(Date, 'now').mockReturnValue(32);
  expect(actions.conversationScreenClosed())
    .toMatchSnapshot();
});

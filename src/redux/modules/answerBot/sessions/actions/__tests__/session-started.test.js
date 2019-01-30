import * as actions from '../session-started';

test('sessionStarted generates the expected payload', () => {
  jest.spyOn(Date, 'now').mockReturnValue(22222);
  expect(actions.sessionStarted())
    .toMatchSnapshot();
});

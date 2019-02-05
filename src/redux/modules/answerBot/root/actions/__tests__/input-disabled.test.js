import * as actions from '../input-disabled';

test('inputDisabled dispatches expected payload', () => {
  expect(actions.inputDisabled(true))
    .toMatchSnapshot();
  expect(actions.inputDisabled(false))
    .toMatchSnapshot();
});

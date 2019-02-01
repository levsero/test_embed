import * as actions from '../question-value-changed';

test('questionValueChanged dispatches expected payload', () => {
  expect(actions.questionValueChanged('hello'))
    .toMatchSnapshot();
});


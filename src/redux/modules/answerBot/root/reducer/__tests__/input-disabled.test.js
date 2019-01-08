import reducer from '../input-disabled';
import * as actionTypes from '../../action-types';

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' }))
    .toEqual(false);
});

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.INPUT_DISABLED,
    payload: true
  });

  expect(state)
    .toMatchSnapshot();
});

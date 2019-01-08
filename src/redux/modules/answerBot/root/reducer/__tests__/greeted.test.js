import reducer from '../greeted';
import * as actionTypes from '../../action-types';

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' }))
    .toEqual(false);
});

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.BOT_GREETED,
    payload: true
  });

  expect(state)
    .toMatchSnapshot();
});

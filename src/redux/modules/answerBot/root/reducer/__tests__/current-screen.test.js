import reducer from '../current-screen';
import * as actionTypes from '../../action-types';

test('initial state is null', () => {
  expect(reducer(undefined, { type: '' }))
    .toEqual('conversation');
});

test('updates to expected state', () => {
  const state = reducer(undefined, {
    type: actionTypes.SCREEN_CHANGED,
    payload: 'blahblah'
  });

  expect(state)
    .toMatchSnapshot();
});

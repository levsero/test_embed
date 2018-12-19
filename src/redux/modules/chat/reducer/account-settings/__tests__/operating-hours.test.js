import reducer from '../operating-hours';
import { GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS } from '../../../chat-action-types';

const initialState = () => {
  return reducer(undefined, { type: '' });
};

const reduce = (payload) => {
  return reducer(initialState(), {
    type: GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
    payload
  });
};

test('initial state', () => {
  expect(initialState())
    .toEqual({
      display_notice: false
    });
});

describe('when GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      operating_hours: {
        display_notice: true
      }
    };

    expect(reduce(payload))
      .toEqual({
        display_notice: true
      });
  });
});

import reducer from '../branding';
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
      hide_branding: false
    });
});

describe('when GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      branding: {
        hide_branding: true
      }
    };

    expect(reduce(payload))
      .toEqual({
        hide_branding: true
      });
  });

  it('keeps the defaults if payload does not include setting', () => {
    const payload = {
      webWidget: {
        chat: {
          profileCard: {
            avatar: false
          }
        }
      }
    };

    expect(reduce(payload))
      .toEqual({
        hide_branding: false
      });
  });
});

import reducer from '../chat-profile-card';
import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types';

const initialState = () => {
  return reducer(undefined, { type: '' });
};

const reduce = (payload) => {
  return reducer(initialState(), {
    type: settingsActionTypes.UPDATE_SETTINGS,
    payload: payload
  });
};

test('initial state', () => {
  expect(initialState())
    .toEqual({
      avatar: true,
      title: true,
      rating: true
    });
});

describe('when UPDATE_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      webWidget: {
        chat: {
          profileCard: {
            avatar: false,
            title: true,
            rating: false
          }
        }
      }
    };

    expect(reduce(payload))
      .toEqual({
        avatar: false,
        title: true,
        rating: false
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
        avatar: false,
        title: true,
        rating: true
      });
  });
});

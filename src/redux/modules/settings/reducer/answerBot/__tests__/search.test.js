import reducer from '../search';
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
    .toEqual({ labels: [] });
});

describe('when UPDATE_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      webWidget: {
        answerBot: {
          search: {
            labels: ['hello', 'world']
          }
        }
      }
    };

    expect(reduce(payload))
      .toEqual({ labels: ['hello', 'world'] });
  });
});

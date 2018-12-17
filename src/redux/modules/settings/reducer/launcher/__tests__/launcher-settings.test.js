import reducer from '../launcher-settings';
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types';

const defaultState = () => {
  return {
    chatLabel: null,
    label: null
  };
};

const reduce = (payload) => {
  return reducer(defaultState(), {
    type: UPDATE_SETTINGS,
    payload: payload
  });
};

test('default state', () => {
  expect(reducer(undefined, {}))
    .toEqual(defaultState());
});

describe('when UPDATE_SETTINGS is dispatched', () => {
  describe('when updates chatLabel', () => {
    const payload = {
      webWidget: {
        launcher: {
          chatLabel: 'new chat label'
        }
      }
    };

    const expected =  {
      'chatLabel': 'new chat label',
      'label': null
    };

    expect(reduce(payload))
      .toEqual(expected);
  });

  describe('when updates label', () => {
    const payload = {
      webWidget: {
        launcher: {
          label: 'new label'
        }
      }
    };

    const expected =  {
      'chatLabel': null,
      'label': 'new label'
    };

    expect(reduce(payload))
      .toEqual(expected);
  });
});

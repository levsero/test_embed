import reducer from '../delay-channel-choice';
import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types';

const initialState = () => {
  return reducer(undefined, { type: '' });
};

const reduce = (payload, customState) => {
  const state = customState || initialState();

  return reducer(state, {
    type: settingsActionTypes.UPDATE_SETTINGS,
    payload: payload
  });
};

test('initial state', () => {
  expect(initialState())
    .toEqual(false);
});

describe('when UPDATE_SETTINGS is dispatched', () => {
  describe('with default settings', () => {
    it('updates the settings to true', () => {
      const payload = {
        webWidget: {
          answerBot: {
            contactOnlyAfterQuery: true
          }
        }
      };

      expect(reduce(payload))
        .toEqual(true);
    });
  });

  describe('when already set to true', () => {
    it('updates the settings to false', () => {
      const payload = {
        webWidget: {
          answerBot: {
            contactOnlyAfterQuery: false
          }
        }
      };

      expect(reduce(payload, true))
        .toEqual(false);
    });

    describe('when contactOnlyAfterQuery is not updated', () => {
      it('remains true', () => {
        const payload = {
          webWidget: {
            answerBot: {
              title: 'false'
            }
          }
        };

        expect(reduce(payload, true))
          .toEqual(true);
      });
    });
  });
});

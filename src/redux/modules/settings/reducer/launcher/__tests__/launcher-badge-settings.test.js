import reducer from '../launcher-badge-settings';
import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types';

describe('launcher settings reducer', () => {
  const initialState = reducer(undefined, { type: '' });
  let expectedState,
    type,
    payload,
    result;

  beforeEach(() => {
    result = reducer(initialState, {
      type,
      payload
    });
  });

  describe('when a nonsense action is passed', () => {
    beforeAll(() => {
      type = 'RUBBISH';
    });

    it('returns the initial state', () => {
      expect(result).toEqual(initialState);
    });
  });

  describe('when an UPDATE_SETTINGS action is passed', () => {
    beforeAll(() => {
      type = settingsActionTypes.UPDATE_SETTINGS;
    });

    describe('when there is no payload', () => {
      beforeAll(() => {
        payload = undefined;
      });

      it('returns the initial state', () => {
        expect(result).toEqual(initialState);
      });
    });

    describe('when there is a payload', () => {
      describe('when the payload is incorrectly formed', () => {
        beforeAll(() => {
          payload = {
            foo: 'bar'
          };
        });

        it('does not update the state', () => {
          expect(result).toEqual(initialState);
        });
      });

      describe('when the payload is correctly formed', () => {
        beforeAll(() => {
          payload = {
            webWidget: {
              launcher: {
                badge: {
                  label: {
                    '*': 'my cool badge label'
                  }
                }
              }
            }
          };

          expectedState = {
            ...initialState,
            label: {
              '*': 'my cool badge label'
            }
          };
        });

        it('returns the new updated state', () => {
          expect(result).toEqual(expectedState);
        });
      });
    });
  });
});

import reducer from '../index';
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types';

describe('launcher settings reducer', () => {
  let defaultState;
  let result;

  beforeEach(() => {
    result = {};
    defaultState = reducer(undefined, { type: '' });
  });

  describe('default state', () => {
    it('is correctly set', () => {
      expect(defaultState).toEqual({
        zIndex: 999999,
        positionVertical: 'bottom',
        positionHorizontal: null,
        offsetHorizontal: 0,
        offsetVertical: 0,
        offsetMobileHorizontal: 0,
        offsetMobileVertical: 0
      });
    });
  });

  describe('when an UPDATE_SETTINGS action is passed', () => {
    const type = UPDATE_SETTINGS;

    describe('when the payload is not a not in state', () => {
      beforeEach(() => {
        const payload = { webWidget: { notConnected: 'hey' } };

        result = reducer(defaultState, { type, payload });
      });

      it('returns the initial state', () => {
        expect(result).toEqual(defaultState);
      });
    });

    describe('when the payload updates the state', () => {
      beforeEach(() => {
        const payload = {
          webWidget: {
            offset: {
              vertical: 10,
              horizontal: 15,
              mobile: {
                vertical: 20,
                horizontal: 30,
              }
            },
            position: {
              vertical: 'top',
              horizontal: 'left',
            },
            zIndex: 10000
          }
        };

        result = reducer(defaultState, { type, payload });
      });

      it('updates the state', () => {
        expect(result).toEqual({
          offsetHorizontal: 15,
          offsetMobileHorizontal: 30,
          offsetMobileVertical: 20,
          offsetVertical: 10,
          positionHorizontal: 'left',
          positionVertical: 'top',
          zIndex: 10000
        });
      });
    });
  });
});

import reducer from '../index';
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types';

describe('talk settings reducer', () => {
  const callReducer = (state, payload) => (
    reducer(state, { type: UPDATE_SETTINGS, payload })
  );
  const initialState = reducer(undefined, { action: '' });
  const payload = {
    webWidget: {
      talk: {
        title: { '*': 'Party Business' },
        suppress: true,
        nickname: 'Bilbo Baggins'
      }
    }
  };

  describe('when a nonsense action is passed', () => {
    it('does not update the state', () => {
      const result = reducer(
        undefined,
        { type: 'DERP', payload }
      );

      expect(result).toEqual(initialState);
    });
  });

  describe('when an UPDATE_SETTINGS action is passed', () => {
    describe('when there is no payload', () => {
      it('returns the current state', () => {
        const result = callReducer(initialState, {});

        expect(result).toEqual(initialState);
      });
    });

    describe('when there is a payload', () => {
      describe('when the payload is malformed', () => {
        it('does not update the state', () => {
          const result = callReducer(initialState, { foo: 'bar' });

          expect(result).toEqual(initialState);
        });
      });

      describe('when the payload is correctly formed', () => {
        it('updates the state', () => {
          const result = callReducer(initialState, payload);

          expect(result).toEqual(payload.webWidget.talk);
        });
      });
    });
  });
});

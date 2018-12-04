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
        launcher: '',
        launcherText: '',
        theme: '',
        button: '',
        resultLists: '',
        header: '',
        articleLinks: ''
      });
    });
  });

  describe('when an UPDATE_SETTINGS action is passed', () => {
    const type = UPDATE_SETTINGS;

    describe('when the payload is not a color', () => {
      beforeEach(() => {
        const payload = { webWidget: { notConnected: 'hey' } };

        result = reducer(defaultState, { type, payload });
      });

      it('returns the initial state', () => {
        expect(result).toEqual(defaultState);
      });
    });

    describe('when the payload is a color', () => {
      beforeEach(() => {
        const payload = { webWidget: {
          color: {
            launcher: 'green',
            launcherText: 'blue',
            theme: 'black',
            button: 'yellow',
            resultLists: 'aubergine',
            header: 'unknown',
            articleLinks: 'purple'
          }
        } };

        result = reducer(defaultState, { type, payload });
      });

      it('updates the state', () => {
        expect(result).toEqual({
          launcher: 'green',
          launcherText: 'blue',
          theme: 'black',
          button: 'yellow',
          resultLists: 'aubergine',
          header: 'unknown',
          articleLinks: 'purple'
        });
      });
    });
  });
});

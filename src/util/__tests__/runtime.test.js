import { inDebugMode } from '../runtime';
import { store } from 'service/persistence';

beforeEach(() => {
  store.clear();
});

describe('#inDebugMode', () => {
  it('returns false by default', () => {
    expect(inDebugMode()).toEqual(false);
  });

  describe('when the \'debug\' flag is set to true', () => {
    beforeEach(() => {
      store.set('debug', true);
    });

    it('returns true', () => {
      expect(inDebugMode()).toEqual(true);
    });
  });
});

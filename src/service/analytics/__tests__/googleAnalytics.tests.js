import { GA } from '../googleAnalytics';

jest.mock('utility/globals');

const globals = require('utility/globals');

describe('when there is no GA snippet on the page', () => {
  beforeEach(() => {
    globals.win = {};
  });

  it('returns null', () => {
    GA.init();

    expect(GA.get())
      .toBe(null);
  });
});

describe('when there is a new GA snippet on the page', () => {
  beforeEach(() => {
    globals.win = {
      GoogleAnalyticsObject: 'ga',
      ga: () => 'newGA'
    };
    GA.init();
  });

  it('returns the ga object of the window', () => {
    const gaFn = GA.get();

    expect(gaFn())
      .toEqual('newGA');
  });
});

describe('when there is a old GA snippet on the page', () => {
  beforeEach(() => {
    globals.win = {
      _gaq: 'oldGaq',
      _gat: 'oldGat'
    };
    GA.init();
  });

  it('returns an object containing the gat and gaq of the window', () => {
    expect(GA.get())
      .toEqual({
        gaq: 'oldGaq',
        gat: 'oldGat'
      });
  });
});

describe('google analytics', () => {
  let GA,
    mockWin = {};
  const filePath = buildSrcPath('service/analytics/googleAnalytics');
  const GA_CATEGORY = 'Web Widget';

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'utility/globals': { win: mockWin },
      'constants/shared': {
        GA_CATEGORY
      }
    });

    mockery.registerAllowable(filePath);

    GA = requireUncached(filePath).GA;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#ga', () => {
    describe('when there is no GA snippet on the page', () => {
      it('returns null', () => {
        GA.init();

        expect(GA.get())
          .toBe(null);
      });
    });

    describe('when there is a new GA snippet on the page', () => {
      beforeAll(() => {
        mockWin = {
          GoogleAnalyticsObject: 'ga',
          ga: () => 'newGA'
        };
      });

      beforeEach(() => {
        GA.init();
      });

      it('returns the ga object of the window', () => {
        const gaFn = GA.get();

        expect(gaFn())
          .toEqual('newGA');
      });
    });

    describe('when there is a old GA snippet on the page', () => {
      beforeAll(() => {
        mockWin = {
          _gaq: 'oldGaq',
          _gat: 'oldGat'
        };
      });

      beforeEach(() => {
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
  });
});

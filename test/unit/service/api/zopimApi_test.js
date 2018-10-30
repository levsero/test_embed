describe('zopimApi', () => {
  let zopimApi;
  const apiPath = buildSrcPath('service/api/zopimApi');
  const toggleSpy = jasmine.createSpy('toggle');
  const dispatch = () => (action) => action();
  const mockStore = { dispatch };

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatTags: noop
      },
      'src/service/api/apis': {
        toggleApi: toggleSpy
      }
    });

    mockery.registerAllowable(apiPath);
    zopimApi = requireUncached(apiPath).zopimApi;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleZopimQueue', () => {
    describe('when the queue method is a function', () => {
      const methodSpy = jasmine.createSpy('apiMethod');

      beforeEach(() => {
        zopimApi.handleZopimQueue([ methodSpy ]);
      });

      it('calls the function in the queue', () => {
        expect(methodSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the queue method is not a function', () => {
      it('throws a error', () => {
        expect(() => {
          zopimApi.handleZopimQueue([ undefined ]);
        }).toThrow();
      });
    });
  });

  describe('setupZopimQueue', () => {
    describe('when $zopim has not been defined on the window', () => {
      const mockWin = {};

      beforeEach(() => {
        zopimApi.setupZopimQueue(mockWin, []);
      });

      describe('creates a zopim global function with', () => {
        it('a queue', () => {
          expect(mockWin.$zopim._)
            .toEqual([]);
        });

        it('a set function', () => {
          expect(mockWin.$zopim.set)
            .toEqual(jasmine.any(Function));
        });

        it('a set function queue', () => {
          expect(mockWin.$zopim.set._)
            .toEqual([]);
        });
      });

      describe('when the $zopim global function is called', () => {
        beforeEach(() => {
          mockWin.$zopim('mockApiCall');
        });

        it('queues the call', () => {
          expect(mockWin.$zopim._)
            .toContain('mockApiCall');
        });
      });
    });

    describe('when $zopim has already been defined on the window', () => {
      const mockWin = { $zopim: 'already defined!!' };

      beforeEach(() => {
        zopimApi.setupZopimQueue(mockWin, mockStore);
      });

      it('does not override $zopim on win', () => {
        expect(mockWin.$zopim)
          .toEqual('already defined!!');
      });
    });
  });

  describe('setUpZopimApiMethods', () => {
    const mockWin = {};

    beforeEach(() => {
      zopimApi.setUpZopimApiMethods(mockWin, mockStore);
    });

    describe('when the method is toggle', () => {
      beforeEach(() => {
        mockWin.$zopim.livechat.window.toggle();
      });

      it('calls toggle api', () => {
        expect(toggleSpy)
          .toHaveBeenCalled();
      });
    });
  });
});

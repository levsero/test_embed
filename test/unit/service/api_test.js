describe('api', () => {
  let api;
  const apiPath = buildSrcPath('service/api');
  const broadcastSpy = jasmine.createSpy('broadcast');
  const setLocaleSpy = jasmine.createSpy('setLocale');
  const handleIdentifyRecievedSpy = jasmine.createSpy('handleIdentifyRecieved');
  const updateSettingsSpy = jasmine.createSpy('updateSettings');
  const logoutSpy = jasmine.createSpy('logout');
  const chatLogoutSpy = jasmine.createSpy('chatLogout');
  const setContextualSuggestionsManuallySpy = jasmine.createSpy('setContextualSuggestionsManually');
  const dispatch = () => (action) => action();
  const mockStore = {
    dispatch
  };

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'service/i18n': {
        i18n: {
          setLocale: setLocaleSpy
        }
      },
      'service/mediator': {
        mediator: {
          channel: {
            broadcast: broadcastSpy
          }
        }
      },
      'service/renderer': {
        renderer: {}
      },
      'src/redux/modules/base': {
        handleIdentifyRecieved: handleIdentifyRecievedSpy,
        logout: logoutSpy
      },
      'src/redux/modules/helpCenter': {
        displayArticle: noop,
        setContextualSuggestionsManually: setContextualSuggestionsManuallySpy
      },
      'src/redux/modules/settings': {
        updateSettings: updateSettingsSpy
      },
      'src/redux/modules/chat': {
        chatLogout: chatLogoutSpy
      }
    });

    mockery.registerAllowable(apiPath);
    api = requireUncached(apiPath).api;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleQueue', () => {
    describe('when the queue method is a function', () => {
      const queueSpy = jasmine.createSpy('queue');

      beforeEach(() => {
        api.handleQueue(null, [ [ queueSpy ] ]);
      });

      it('calls the function in the queue', () => {
        expect(queueSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the queue method is a string that contains webWidget', () => {
      let call;

      beforeEach(() => {
        api.handleQueue(mockStore, [ call ]);
      });

      afterEach(() => {
        broadcastSpy.calls.reset();
      });

      describe('when that call is perform hide', () => {
        beforeAll(() => {
          call = ['webWidget:perform', 'hide'];
        });

        it('calls mediator hide', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.hide');
        });
      });

      describe('when that call is perform setLocale', () => {
        beforeAll(() => {
          call = ['webWidget:perform', 'setLocale', 'fr'];
        });

        it('calls mediator onSetLocale with the locale', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.onSetLocale', 'fr');
        });

        it('calls i18n setLocale with the locale', () => {
          expect(setLocaleSpy)
            .toHaveBeenCalledWith('fr', true);
        });
      });

      describe('when that call is perform idenfity', () => {
        const user = { email: 'a2b.c' };

        beforeAll(() => {
          call = ['webWidget:perform', 'identify', user];
        });

        it('calls mediator onIdentify with the user', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.onIdentify', user);
        });

        it('calls handleIdentifyRecieved with the user', () => {
          expect(handleIdentifyRecievedSpy)
            .toHaveBeenCalledWith(user, jasmine.any(Function));
        });
      });

      describe('when that call is perform updateSettings', () => {
        const settings = { webWidget: { color: '#fff' } };

        beforeAll(() => {
          call = ['webWidget:perform', 'updateSettings', settings];
        });

        it('calls updateSettings with the settings', () => {
          expect(updateSettingsSpy)
            .toHaveBeenCalledWith(settings);
        });
      });

      describe('when that call is perform logout', () => {
        beforeAll(() => {
          call = ['webWidget:perform', 'logout'];
        });

        it('calls logout', () => {
          expect(logoutSpy)
            .toHaveBeenCalled();
        });

        it('calls chat logout', () => {
          expect(chatLogoutSpy)
            .toHaveBeenCalled();
        });

        it('calls mediator logout', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.logout');
        });
      });

      describe('when that call is perform setHelpCenterSuggestions', () => {
        const options = { url: true };

        beforeAll(() => {
          call = ['webWidget:perform', 'setHelpCenterSuggestions', options];
        });

        it('calls setHelpCenterSuggestions with the options', () => {
          expect(setContextualSuggestionsManuallySpy)
            .toHaveBeenCalledWith(options, jasmine.any(Function));
        });
      });
    });
  });

  describe('setupWidgetQueue', () => {
    describe('win.zEmbed', () => {
      let win = { zEmbed: {} };

      beforeEach(() => {
        api.setupWidgetQueue(win, [], mockStore);
      });

      describe('when a function is passed into zEmbed', () => {
        const zEFunctionSpy = jasmine.createSpy();

        beforeEach(() => {
          win.zEmbed(zEFunctionSpy);
        });

        it('calls the function passed in', () => {
          expect(zEFunctionSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when a string is passed into zEmbed', () => {
        beforeEach(() => {
          win.zEmbed('webWidget:perform', 'hide');
        });

        it('handles the api call', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.hide');
        });
      });
    });
  });
});

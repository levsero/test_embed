describe('api', () => {
  let api;
  const apiPath = buildSrcPath('service/api');
  const broadcastSpy = jasmine.createSpy('broadcast');
  const setLocaleSpy = jasmine.createSpy('setLocale');
  const handlePrefillReceivedSpy = jasmine.createSpy('handlePrefillReceived');
  const updateSettingsSpy = jasmine.createSpy('updateSettings');
  const sendVisitorPathSpy = jasmine.createSpy('sendVisitorPath');
  const apiClearFormSpy = jasmine.createSpy('apiClearForm');
  const logoutSpy = jasmine.createSpy('logout');
  const chatLogoutSpy = jasmine.createSpy('chatLogout');
  const setContextualSuggestionsManuallySpy = jasmine.createSpy('setContextualSuggestionsManually');
  const handleOnApiCalledSpy = jasmine.createSpy('handleOnApiCalled');
  const rendererHideSpy = jasmine.createSpy('rendererHide');
  const endChatSpy = jasmine.createSpy('endChat');
  const sendMsgSpy = jasmine.createSpy('sendMsg');
  const dispatch = () => (action) => action();
  const mockStore = {
    dispatch,
    getState: noop
  };
  const isChatting = true;
  const CLOSE_BUTTON_CLICKED = 'CLOSE_BUTTON_CLICKED';
  const API_ON_CLOSE_NAME = 'API_ON_CLOSE_NAME';
  const API_GET_IS_CHATTING_NAME = 'API_GET_IS_CHATTING_NAME';

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
        renderer: {
          hide: rendererHideSpy,
          postRenderCallbacks: noop
        }
      },
      'src/redux/modules/base': {
        handlePrefillReceived: handlePrefillReceivedSpy,
        logout: logoutSpy,
        handleOnApiCalled: handleOnApiCalledSpy,
        apiClearForm: apiClearFormSpy
      },
      'src/redux/modules/helpCenter': {
        displayArticle: noop,
        setContextualSuggestionsManually: setContextualSuggestionsManuallySpy
      },
      'src/redux/modules/settings': {
        updateSettings: updateSettingsSpy
      },
      'src/redux/modules/chat': {
        chatLogout: chatLogoutSpy,
        sendVisitorPath: sendVisitorPathSpy,
        endChat: endChatSpy,
        sendMsg: sendMsgSpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getIsChatting: () => isChatting
      },
      'src/redux/modules/base/base-selectors': {
        getWidgetDisplayInfo: noop
      },
      'src/redux/modules/base/base-action-types': {
        CLOSE_BUTTON_CLICKED
      },
      'constants/api': {
        API_ON_CLOSE_NAME,
        API_GET_IS_CHATTING_NAME
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

    describe('when the queue method is a string', () => {
      beforeEach(() => {
        api.handleQueue(mockStore, [ ['webWidget', 'hide'] ]);
      });

      afterEach(() => {
        broadcastSpy.calls.reset();
        handleOnApiCalledSpy.calls.reset();
      });

      it('handles the api call', () => {
        expect(rendererHideSpy)
          .toHaveBeenCalled();
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
          win.zEmbed('webWidget', 'hide');
        });

        it('handles the api call', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.hide');
        });
      });
    });
  });

  describe('pre render methods', () => {
    let call;

    beforeEach(() => {
      api.handleQueue(mockStore, [ call ]);
      api.handlePostRenderQueue({}, [], mockStore);
    });

    afterEach(() => {
      broadcastSpy.calls.reset();
      handleOnApiCalledSpy.calls.reset();
    });

    describe('when that call is hide', () => {
      beforeAll(() => {
        call = ['webWidget', 'hide'];
      });

      it('calls renderer hide', () => {
        expect(rendererHideSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is setLocale', () => {
      beforeAll(() => {
        call = ['webWidget', 'setLocale', 'fr'];
      });

      it('calls i18n setLocale with the locale', () => {
        expect(setLocaleSpy)
          .toHaveBeenCalledWith('fr');
      });
    });

    describe('when the call is clear', () => {
      beforeAll(() => {
        call = ['webWidget', 'clear'];
      });

      it('calls apiClearForm', () => {
        expect(apiClearFormSpy).toHaveBeenCalled();
      });
    });

    describe('methods that get queued', () => {
      describe('when that call is idenfity', () => {
        const user = { email: 'a2b.c' };

        beforeAll(() => {
          call = ['webWidget', 'identify', user];
        });

        it('calls mediator onIdentify with the user', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.onIdentify', user);
        });
      });

      describe('when that call is prefill', () => {
        const payload = {
          name: { value: 'Terence', readOnly: true },
          email: { value: 'a2b.c' }
        };

        beforeAll(() => {
          call = ['webWidget', 'prefill', payload];
        });

        it('calls handlePrefillReceived with the user', () => {
          expect(handlePrefillReceivedSpy)
            .toHaveBeenCalledWith(payload);
        });
      });

      describe('when that call is updateSettings', () => {
        const settings = { webWidget: { color: '#fff' } };

        beforeAll(() => {
          call = ['webWidget', 'updateSettings', settings];
        });

        it('calls updateSettings with the settings', () => {
          expect(updateSettingsSpy)
            .toHaveBeenCalledWith(settings);
        });
      });

      describe('when that call is logout', () => {
        beforeAll(() => {
          call = ['webWidget', 'logout'];
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

      describe('when that call is setHelpCenterSuggestions', () => {
        const options = { url: true };

        beforeAll(() => {
          call = ['webWidget', 'setSuggestions', options];
        });

        it('calls setHelpCenterSuggestions with the options', () => {
          expect(setContextualSuggestionsManuallySpy)
            .toHaveBeenCalledWith(options, jasmine.any(Function));
        });
      });

      describe('when that call is updatePath', () => {
        const options = { title: 'payments', url: 'https://zd.com#payments' };

        beforeAll(() => {
          call = ['webWidget', 'updatePath', options];
        });

        it('calls sendVisitorPath with the options', () => {
          expect(sendVisitorPathSpy)
            .toHaveBeenCalledWith(options);
        });
      });
    });
  });

  describe('post render methods', () => {
    let call, result;
    let win = { zEmbed: {} };

    beforeEach(() => {
      api.setupWidgetQueue(win, [], mockStore);
      result = win.zEmbed(...call);
    });

    afterEach(() => {
      broadcastSpy.calls.reset();
      handleOnApiCalledSpy.calls.reset();
    });

    describe('when that call is hide', () => {
      beforeAll(() => {
        call = ['webWidget', 'hide'];
      });

      it('calls mediator hide', () => {
        expect(broadcastSpy)
          .toHaveBeenCalledWith('.hide');
      });
    });

    describe('when that call is setLocale', () => {
      beforeAll(() => {
        call = ['webWidget', 'setLocale', 'fr'];
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

    describe('when that call is idenfity', () => {
      const user = { email: 'a2b.c' };

      beforeAll(() => {
        call = ['webWidget', 'identify', user];
      });

      it('calls mediator onIdentify with the user', () => {
        expect(broadcastSpy)
          .toHaveBeenCalledWith('.onIdentify', user);
      });
    });

    describe('when that call is prefill', () => {
      const payload = {
        name: { value: 'T-bone', readOnly: true },
        email: { value: 'a2b.c' }
      };

      beforeAll(() => {
        call = ['webWidget', 'prefill', payload];
      });

      it('calls handlePrefillReceived with the user', () => {
        expect(handlePrefillReceivedSpy)
          .toHaveBeenCalledWith(payload);
      });
    });

    describe('when that call is updateSettings', () => {
      const settings = { webWidget: { color: '#fff' } };

      beforeAll(() => {
        call = ['webWidget', 'updateSettings', settings];
      });

      it('calls updateSettings with the settings', () => {
        expect(updateSettingsSpy)
          .toHaveBeenCalledWith(settings);
      });
    });

    describe('when that call is logout', () => {
      beforeAll(() => {
        call = ['webWidget', 'logout'];
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

    describe('when that call is setHelpCenterSuggestions', () => {
      const options = { url: true };

      beforeAll(() => {
        call = ['webWidget', 'setSuggestions', options];
      });

      it('calls setHelpCenterSuggestions with the options', () => {
        expect(setContextualSuggestionsManuallySpy)
          .toHaveBeenCalledWith(options, jasmine.any(Function));
      });
    });

    describe('when that call is updatePath', () => {
      const options = { title: 'payments', url: 'https://zd.com#payments' };

      beforeAll(() => {
        call = ['webWidget', 'updatePath', options];
      });

      it('calls sendVisitorPath with the options', () => {
        expect(sendVisitorPathSpy)
          .toHaveBeenCalledWith(options);
      });
    });

    describe('when that call is endChat', () => {
      beforeAll(() => {
        call = ['webWidget', 'chat:end'];
      });

      it('calls endChat with the options', () => {
        expect(endChatSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is sendChatMsg', () => {
      beforeAll(() => {
        call = ['webWidget', 'chat:send'];
      });

      it('calls sendMsg with the options', () => {
        expect(sendMsgSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is on', () => {
      describe('when third param is not a function', () => {
        beforeAll(() => {
          call = ['webWidget:on', 'close', null];
        });

        it('does not call handleOnApiCalled', () => {
          expect(handleOnApiCalledSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when third param is a function', () => {
        describe('when event is in the listenersMap', () => {
          beforeAll(() => {
            call = ['webWidget:on', API_ON_CLOSE_NAME, noop];
          });

          it('calls handleOnApiCalled with the actions associated with the event and callback', () => {
            expect(handleOnApiCalledSpy)
              .toHaveBeenCalledWith([CLOSE_BUTTON_CLICKED], noop);
          });
        });

        describe('when event is not in the listenersMap', () => {
          beforeAll(() => {
            call = ['webWidget:on', 'anotherevent', noop];
          });

          it('does not call handleOnApiCalled', () => {
            expect(handleOnApiCalledSpy)
              .not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when that call is get', () => {
      describe('when the param is part of the allowList', () => {
        beforeAll(() => {
          call = ['webWidget:get', `chat:${API_GET_IS_CHATTING_NAME}`];
        });

        it('returns the value corresponding to the param', () => {
          expect(result)
            .toBe(isChatting);
        });
      });

      describe('when the param is not part of the allowList', () => {
        beforeAll(() => {
          call = ['webWidget:get', 'something else'];
        });

        it('returns undefined', () => {
          expect(result)
            .toBe(undefined);
        });
      });
    });
  });
});

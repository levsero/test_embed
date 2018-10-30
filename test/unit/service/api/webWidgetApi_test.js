describe('webWidgetApi', () => {
  let api;
  const apiPath = buildSrcPath('service/api/webWidgetApi');
  const broadcastSpy = jasmine.createSpy('broadcast');
  const setLocaleSpy = jasmine.createSpy('setLocale');
  const showSpy = jasmine.createSpy('show');
  const openSpy = jasmine.createSpy('open');
  const closeSpy = jasmine.createSpy('close');
  const toggleSpy = jasmine.createSpy('toggle');
  const hideSpy = jasmine.createSpy('hide');
  const updateSettingsSpy = jasmine.createSpy('updateSettings');
  const updatePathSpy = jasmine.createSpy('updatePath');
  const logoutSpy = jasmine.createSpy('logout');
  const identifySpy = jasmine.createSpy('identify');
  const prefillSpy = jasmine.createSpy('prefill');
  const clearFormStateSpy = jasmine.createSpy('clearFormState');
  const setHelpCenterSuggestionsSpy = jasmine.createSpy('setHelpCenterSuggestions');
  const onApiSpy = jasmine.createSpy('onApi');
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
  const API_ON_CHAT_STATUS_NAME = 'API_ON_CHAT_STATUS_NAME';
  const API_ON_CHAT_CONNECTED_NAME = 'API_ON_CHAT_CONNECTED_NAME';
  const API_ON_CHAT_START_NAME = 'API_ON_CHAT_START_NAME';
  const API_ON_CHAT_END_NAME = 'API_ON_CHAT_END_NAME';
  const API_ON_UNREAD_MSGS_NAME = 'API_ON_UNREAD_MSGS_NAME';
  const API_ON_OPEN_NAME = 'API_ON_OPEN_NAME';

  const CHAT_CONNECTED = 'CHAT_CONNECTED';
  const END_CHAT_REQUEST_SUCCESS = 'END_CHAT_REQUEST_SUCCESS';
  const NEW_UNREAD_MESSAGE_RECEIVED = 'NEW_UNREAD_MESSAGE_RECEIVED';
  const CHAT_STARTED = 'CHAT_STARTED';
  const SDK_ACCOUNT_STATUS = 'SDK_ACCOUNT_STATUS';

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
          postRenderCallbacks: noop
        }
      },
      'src/redux/modules/base': {
        activateRecieved: noop,
        legacyShowRecieved: noop
      },
      'src/redux/modules/helpCenter': {
        displayArticle: noop
      },
      'src/redux/modules/chat/chat-selectors': {
      },
      'src/redux/modules/selectors': {
        getWidgetDisplayInfo: noop
      },
      'src/redux/modules/base/base-action-types': {
        CLOSE_BUTTON_CLICKED
      },
      'constants/api': {
        API_ON_CLOSE_NAME,
        API_GET_IS_CHATTING_NAME,
        API_ON_CHAT_STATUS_NAME,
        API_ON_CHAT_CONNECTED_NAME,
        API_ON_CHAT_START_NAME,
        API_ON_CHAT_END_NAME,
        API_ON_UNREAD_MSGS_NAME,
        API_ON_OPEN_NAME
      },
      'src/redux/modules/chat/chat-action-types': {
        CHAT_CONNECTED,
        END_CHAT_REQUEST_SUCCESS,
        NEW_UNREAD_MESSAGE_RECEIVED,
        CHAT_STARTED,
        SDK_ACCOUNT_STATUS
      },
      'src/service/api/apis': {
        endChatApi: endChatSpy,
        sendChatMsgApi: sendMsgSpy,
        identifyApi: identifySpy,
        openApi: openSpy,
        closeApi: closeSpy,
        toggleApi: toggleSpy,
        setLocaleApi: setLocaleSpy,
        updateSettingsApi: updateSettingsSpy,
        logoutApi: logoutSpy,
        setHelpCenterSuggestionsApi: setHelpCenterSuggestionsSpy,
        prefill: prefillSpy,
        hideApi: hideSpy,
        showApi: showSpy,
        updatePathApi: updatePathSpy,
        clearFormState: clearFormStateSpy,
        isChattingApi: () => isChatting,
        onApiObj: onApiSpy
      }
    });

    mockery.registerAllowable(apiPath);
    api = requireUncached(apiPath).webWidgetApi;
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
      });

      it('handles the api call', () => {
        expect(hideSpy)
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
          expect(hideSpy)
            .toHaveBeenCalled();
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
    });

    describe('when that call is hide', () => {
      beforeAll(() => {
        call = ['webWidget', 'hide'];
      });

      it('calls hideApi', () => {
        expect(hideSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is show', () => {
      beforeAll(() => {
        call = ['webWidget', 'show'];
      });

      it('calls showApi', () => {
        expect(showSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is open', () => {
      beforeAll(() => {
        call = ['webWidget', 'open'];
      });

      it('calls openApi', () => {
        expect(openSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is close', () => {
      beforeAll(() => {
        call = ['webWidget', 'close'];
      });

      it('calls closeApi', () => {
        expect(closeSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is toggle', () => {
      beforeAll(() => {
        call = ['webWidget', 'toggle'];
      });

      it('calls toggleApi', () => {
        expect(toggleSpy)
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

      it('calls clearFormState', () => {
        expect(clearFormStateSpy).toHaveBeenCalled();
      });
    });

    describe('methods that get queued', () => {
      describe('when that call is identity', () => {
        const user = { email: 'a2b.c' };

        beforeAll(() => {
          call = ['webWidget', 'identify', user];
        });

        it('calls mediator onIdentify with the user', () => {
          expect(identifySpy)
            .toHaveBeenCalledWith(mockStore, user);
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

        it('calls prefill api with the user', () => {
          expect(prefillSpy)
            .toHaveBeenCalledWith(mockStore, payload);
        });
      });

      describe('when that call is updateSettings', () => {
        const settings = { webWidget: { color: '#fff' } };

        beforeAll(() => {
          call = ['webWidget', 'updateSettings', settings];
        });

        it('calls updateSettings with the settings', () => {
          expect(updateSettingsSpy)
            .toHaveBeenCalledWith(mockStore, settings);
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
      });

      describe('when that call is setHelpCenterSuggestions', () => {
        const options = { url: true };

        beforeAll(() => {
          call = ['webWidget', 'helpCenter:setSuggestions', options];
        });

        it('calls setHelpCenterSuggestions with the options', () => {
          expect(setHelpCenterSuggestionsSpy)
            .toHaveBeenCalledWith(mockStore, options);
        });
      });

      describe('when that call is updatePath', () => {
        const options = { title: 'payments', url: 'https://zd.com#payments' };

        beforeAll(() => {
          call = ['webWidget', 'updatePath', options];
        });

        it('calls updatePathApi with the options', () => {
          expect(updatePathSpy)
            .toHaveBeenCalledWith(mockStore, options);
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
    });

    describe('when that call is hide', () => {
      beforeAll(() => {
        call = ['webWidget', 'hide'];
      });

      it('calls hideApi', () => {
        expect(hideSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is show', () => {
      beforeAll(() => {
        call = ['webWidget', 'show'];
      });

      it('calls showApi', () => {
        expect(showSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is open', () => {
      beforeAll(() => {
        call = ['webWidget', 'open'];
      });

      it('calls openApi', () => {
        expect(openSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is close', () => {
      beforeAll(() => {
        call = ['webWidget', 'close'];
      });

      it('calls close', () => {
        expect(closeSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is toggle', () => {
      beforeAll(() => {
        call = ['webWidget', 'toggle'];
      });

      it('calls toggleApi', () => {
        expect(toggleSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when that call is setLocale', () => {
      beforeAll(() => {
        call = ['webWidget', 'setLocale', 'fr'];
      });

      it('calls i18n setLocale with the locale', () => {
        expect(setLocaleSpy)
          .toHaveBeenCalledWith(mockStore, 'fr');
      });
    });

    describe('when that call is identify', () => {
      const user = { email: 'a2b.c' };

      beforeAll(() => {
        call = ['webWidget', 'identify', user];
      });

      it('calls mediator onIdentify with the user', () => {
        expect(identifySpy)
          .toHaveBeenCalledWith(mockStore, user);
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

      it('calls prefill api with the user', () => {
        expect(prefillSpy)
          .toHaveBeenCalledWith(mockStore, payload);
      });
    });

    describe('when that call is updateSettings', () => {
      const settings = { webWidget: { color: '#fff' } };

      beforeAll(() => {
        call = ['webWidget', 'updateSettings', settings];
      });

      it('calls updateSettings with the settings', () => {
        expect(updateSettingsSpy)
          .toHaveBeenCalledWith(mockStore, settings);
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
    });

    describe('when that call is setHelpCenterSuggestions', () => {
      const options = { url: true };

      beforeAll(() => {
        call = ['webWidget', 'setSuggestions', options];
      });

      it('calls setHelpCenterSuggestions with the options', () => {
        expect(setHelpCenterSuggestionsSpy)
          .toHaveBeenCalledWith(mockStore, options);
      });
    });

    describe('when that call is updatePath', () => {
      const options = { title: 'payments', url: 'https://zd.com#payments' };

      beforeAll(() => {
        call = ['webWidget', 'updatePath', options];
      });

      it('calls updatePath with the options', () => {
        expect(updatePathSpy)
          .toHaveBeenCalledWith(mockStore, options);
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
      beforeAll(() => {
        call = ['webWidget:on', 'close', () => {}];
      });

      it('calls onApi', () => {
        expect(onApiSpy)
          .toHaveBeenCalled();
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

  describe('legacy apis', () => {
    let win = { zE: {} };
    const user = {
      name: 'Jane Doe',
      email: 'a@b.c'
    };

    beforeEach(() => {
      api.setupWidgetApi(win, mockStore);
      prefillSpy.calls.reset();
    });

    describe('zE.identify', () => {
      beforeEach(() => {
        win.zE.identify(user);
      });

      it('calls handlePrefillReceived with the formatted user object', () => {
        const expected = {
          name: { value: 'Jane Doe' },
          email: { value: 'a@b.c' }
        };

        expect(prefillSpy)
          .toHaveBeenCalled();

        // Can't do toHaveBeenCalledWith because comparing to a object that
        // I don't have the reference to.
        const params = prefillSpy.calls.mostRecent().args[1];

        expect(params)
          .toEqual(expected);
      });
    });
  });
});

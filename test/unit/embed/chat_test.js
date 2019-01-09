describe('embed.chat', () => {
  let chat,
    mockIsMobileBrowserValue,
    mockRegistry,
    mockSettingsValue,
    mockZopim,
    mockOffsetVertical,
    mockOffsetHorizontal,
    mockHorizontalPosition,
    mockVerticalPosition;

  beforeEach(()=> {
    chat = undefined;
    mockIsMobileBrowserValue = undefined;
    mockRegistry = undefined;
    mockSettingsValue = undefined;
    mockZopim = undefined;
    mockOffsetVertical = undefined;
    mockOffsetHorizontal = undefined;
    mockHorizontalPosition = 'right';
    mockVerticalPosition = 'bottom';
  });

  const updateZopimChatStatusSpy = jasmine.createSpy('updateZopimChatStatus');
  const zopimEndChatSpy = jasmine.createSpy('zopimEndChat');
  const closeApiSpy = jasmine.createSpy('closeApi');
  const openApiSpy = jasmine.createSpy('openApi');

  const mockStore = {
    getState: () => ({}),
    dispatch: noop
  };

  const mockGlobals = {
    document: global.document,
    win: {},
    getDocumentHost: () => {
      return document.body;
    }
  };
  const chatPath = buildSrcPath('embed/chat/chat');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    mockIsMobileBrowserValue = false;
    mockSettingsValue = { offset: { horizontal: 0, vertical: 0 } };

    mockZopim = (fn) => fn.bind(mockGlobals)();
    mockZopim.onError = jasmine.createSpy('onError');

    mockZopim.livechat = {
      setOnStatus: jasmine.createSpy('setOnStatus'),
      setOnChatStart: jasmine.createSpy('setOnChatStart'),
      setOnConnected: jasmine.createSpy('setOnConnected'),
      setOnUnreadMsgs: jasmine.createSpy('setOnUnreadMsgs'),
      setLanguage: jasmine.createSpy('setLanguage'),
      setOnChatEnd: jasmine.createSpy('setOnChatEnd'),
      hideAll: jasmine.createSpy('hideAll'),
      setSize: jasmine.createSpy('setSize'),
      setName: jasmine.createSpy('setName'),
      setEmail: jasmine.createSpy('setEmail'),
      isChatting: jasmine.createSpy('isChatting'),
      addTags: jasmine.createSpy('addTags'),
      theme: {
        setColor: jasmine.createSpy('setColor'),
        setTheme: jasmine.createSpy('setTheme')
      },
      window: jasmine.createSpyObj('window', [
        'show',
        'setPosition',
        'setTitle',
        'setOffsetVertical',
        'onShow',
        'setOffsetHorizontal',
        'onHide',
        'getDisplay',
        'setSize'
      ]),
      mobileNotifications: {
        setIgnoreChatButtonVisibility: jasmine.createSpy('setIgnoreChatButtonVisibility'),
        setDisabled: jasmine.createSpy('setDisabled')
      },
      button: jasmine.createSpyObj('button', [
        'show'
      ])
    };

    mockGlobals.win.$zopim = mockZopim;

    mockRegistry = initMockRegistry({
      'lodash': _,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['init', 'setLocale', 'getLocale', 't'])
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'service/settings': {
        settings: {
          get: (name) => _.get(mockSettingsValue, name, null)
        }
      },
      'src/redux/modules/settings/settings-selectors': {
        getStylingOffsetVertical: () => mockOffsetVertical,
        getStylingOffsetHorizontal: () => mockOffsetHorizontal,
        getStylingPositionVertical: () => mockVerticalPosition
      },
      'src/redux/modules/selectors': {
        getHorizontalPosition: () => mockHorizontalPosition
      },
      'src/redux/modules/zopimChat': {
        updateZopimChatStatus: updateZopimChatStatusSpy,
        zopimOnClose: noop,
        zopimHide: noop,
        zopimConnectionUpdate: noop,
        zopimShow: noop,
        zopimClose: noop,
        zopimOpen: noop,
        zopimIsChatting: noop,
        zopimEndChat: zopimEndChatSpy
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowserValue
      },
      'utility/globals': mockGlobals,
      'utility/utils': {
        cappedTimeoutCall: () => {}
      },
      'utility/color/validate': {
        getThemeColor: () => {}
      },
      'src/redux/modules/base': {
        updateActiveEmbed: noop
      },
      'src/service/api/apis': {
        closeApi: closeApiSpy,
        openApi: openApiSpy
      },
      'service/api/zopimApi/helpers': {
        zopimExistsOnPage: () => true
      }
    });

    mockery.registerAllowable(chatPath);
    chat = requireUncached(chatPath).chat;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    it('should create and add a chat', () => {
      expect(_.keys(chat.list()).length)
        .toBe(0);

      chat.create('dave');

      expect(_.keys(chat.list()).length)
        .toBe(1);
    });

    it('should store the zopimId in config', () => {
      const chatName = 'dave';
      const zopimId = 'abc123';

      chat.create(chatName, { zopimId: zopimId }, mockStore);

      expect(chat.get(chatName).config.zopimId)
        .toEqual(zopimId);
    });
  });

  describe('get', () => {
    it('should return the correct chat', () => {
      chat.create('dave',{}, mockStore);
      const dave = chat.get('dave');

      expect(dave)
        .toBeDefined();
    });
  });

  describe('setUser', () => {
    beforeEach(() => {
      chat.create('dave',{}, mockStore);
    });

    it('calls livechat.setName and livechat.setUser', () => {
      chat.setUser({
        name: 'david',
        email: 'david@email.com'
      });

      expect(mockZopim.livechat.setName)
        .toHaveBeenCalledWith('david');
      expect(mockZopim.livechat.setEmail)
        .toHaveBeenCalledWith('david@email.com');
    });

    it('does NOT call livechat.setName when user.name is missing', () => {
      chat.setUser({
        email: 'daniel@email.com'
      });

      expect(mockZopim.livechat.setEmail)
        .toHaveBeenCalledWith('daniel@email.com');
      expect(mockZopim.livechat.setName)
        .not.toHaveBeenCalled();
    });
  });

  describe('render', () => {
    let mockMediator;
    const chatName = 'dave';
    const zopimId = 'abc123';

    it('should inject the zopim bootstrap script into the document', () => {
      mockMediator = mockRegistry['service/mediator'].mediator;
      chat.create(chatName, { zopimId: zopimId }, mockStore);
      chat.render(chatName);

      expect(document.querySelectorAll('body > script').length)
        .toEqual(1);

      const snippetText = document.querySelectorAll('body > script')[0].innerHTML;

      expect(snippetText.indexOf(zopimId) !== -1)
        .toBe(true);

      expect(snippetText.indexOf('https:') !== -1)
        .toBe(true);
    });

    it('should call zopim.livechat.mobileNotifications.setIgnoreChatButtonVisibility()', () => {
      mockMediator = mockRegistry['service/mediator'].mediator;
      chat.create(chatName, { zopimId: zopimId }, mockStore);
      chat.render(chatName);

      expect(mockZopim.livechat.mobileNotifications.setIgnoreChatButtonVisibility)
        .toHaveBeenCalled();
    });

    describe('zopim.endpoint', () => {
      describe('when the config does not exist', () => {
        const chatName = 'bob';
        const config = { zopimId: '123' };

        beforeEach(() => {
          chat.create(chatName, config, mockStore);
          chat.render(chatName);
        });

        it('should inject v2.zopim.com into the zopim snippet', () => {
          const scriptTag = document.querySelector('body > script');

          expect(scriptTag.innerHTML.indexOf('v2.zopim.com'))
            .not.toEqual(-1);
        });
      });

      describe('when the config exists', () => {
        const chatName = 'Sizuki';
        const endpoint = 'v2.zopim.org';
        const config = { endpoint, zopimId: '456' };

        beforeEach(() => {
          chat.create(chatName, config, mockStore);
          chat.render(chatName);
        });

        it(`should inject ${endpoint} into the zopim snippet`, () => {
          const scriptTag = document.querySelector('body > script');

          expect(scriptTag.innerHTML.indexOf(endpoint))
            .not.toEqual(-1);
        });
      });
    });

    describe('mediator broadcasts', () => {
      let mockZopim,
        onHideCall,
        onStatusCall,
        onUnreadMsgsCall,
        onChatStartCall,
        onChatEndCall;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        mockZopim = mockRegistry['utility/globals'].win.$zopim;
        chat.create(chatName, { zopimId: zopimId }, mockStore);
        chat.render(chatName);

        const livechat = mockZopim.livechat;

        onHideCall = livechat.window.onHide.calls.mostRecent();
        onUnreadMsgsCall = livechat.setOnUnreadMsgs.calls.mostRecent();
        onStatusCall = livechat.setOnStatus.calls.mostRecent();
        onChatStartCall = livechat.setOnChatStart.calls.mostRecent();
        onChatEndCall = livechat.setOnChatEnd.calls.mostRecent();
      });

      describe('livechat.onHide', () => {
        it('should broadcast <name>.onHide', () => {
          onHideCall.args[0]();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onHide');
        });
      });

      describe('zopim.livechat.onStatus', () => {
        beforeEach(() => {
          chat.get(chatName).connected = true;
        });

        describe('when agent is online', () => {
          beforeEach(() => {
            onStatusCall.args[0]('online');
          });

          it('broadcasts <name>.onOnline', () => {
            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('dave.onOnline');
          });
        });

        describe('when agent is away', () => {
          beforeEach(() => {
            onStatusCall.args[0]('away');
          });

          it('broadcasts <name>.onOnline', () => {
            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('dave.onOnline');
          });
        });

        describe('when agent is offline', () => {
          beforeEach(() => {
            onStatusCall.args[0]('offline');
          });

          it('broadcasts <name>.onOffline', () => {
            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('dave.onOffline');
          });
        });

        describe('when status is something unexpected', () => {
          beforeEach(() => {
            onStatusCall.args[0](undefined);
          });

          it('broadcasts <name>.onOffline', () => {
            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('dave.onOffline');
          });
        });

        it('calls updateZopimChatStatus with the status', () => {
          onStatusCall.args[0]('online');

          expect(updateZopimChatStatusSpy)
            .toHaveBeenCalledWith('online');
        });
      });

      describe('zopim.onUnreadMsgs', () => {
        it('should broadcast <name>.onUnreadMsgs regardless of count', () => {
          const count = Math.floor(Math.random() * 100);

          onUnreadMsgsCall.args[0](count);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onUnreadMsgs', count, jasmine.any(Object));
        });
      });

      describe('zopim.onChatStart', () => {
        beforeEach(() => {
          onChatStartCall.args[0](false);
        });

        it('broadcasts <name>.onChatStart', () => {
          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onChatStart');
        });
      });

      describe('zopim.onChatEnd', () => {
        beforeEach(() => {
          onChatEndCall.args[0]();
        });

        it('broadcasts <name>.onChatEnd', () => {
          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onChatEnd');
        });

        it('calls zopimEndChat', () => {
          expect(zopimEndChatSpy)
            .toHaveBeenCalled();
        });
      });

      describe('zopim.onError', () => {
        it('should broadcast <name>.onError', () => {
          mockZopim.onError();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onError');
        });
      });
    });

    describe('mediator subscriptions', () => {
      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        chat.create(chatName, { zopimId: zopimId }, mockStore);
        chat.render(chatName);
      });

      it('should subscribe to chat.show', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('dave.show', jasmine.any(Function));
      });

      it('should subscribe to chat.hide', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('dave.hide', jasmine.any(Function));
      });

      it('should subscribe to chat.activate', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('dave.activate', jasmine.any(Function));
      });

      describe('<name>.refreshLocale', () => {
        it('subscribes to refreshLocale', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('dave.refreshLocale', jasmine.any(Function));
        });

        it('calls zopim.livechat.setLanguage', () => {
          pluckSubscribeCall(mockMediator, 'dave.refreshLocale')();

          expect(mockZopim.livechat.setLanguage)
            .toHaveBeenCalled();
        });
      });

      describe('<name>.show', () => {
        it('should call zopim.button.show()', () => {
          chat.create('dave', { zopimId: zopimId, standalone: true }, mockStore);

          pluckSubscribeCall(mockMediator, 'dave.show')();

          expect(mockZopim.livechat.button.show)
            .toHaveBeenCalled();
        });

        it('should call zopim.livechat.mobileNotifications.setDisabled(false)', () => {
          pluckSubscribeCall(mockMediator, 'dave.show')();

          expect(mockZopim.livechat.mobileNotifications.setDisabled)
            .toHaveBeenCalledWith(false);
        });
      });

      describe('<name>.toggle', () => {
        afterEach(() => {
          closeApiSpy.calls.reset();
          openApiSpy.calls.reset();
        });

        describe('when the widget is visible', () => {
          beforeEach(() => {
            mockZopim.livechat.window.getDisplay = () => true;
          });

          it('calls closeApi', () => {
            pluckSubscribeCall(mockMediator, 'dave.toggle')();

            expect(closeApiSpy).toHaveBeenCalled();
            expect(openApiSpy).not.toHaveBeenCalled();
          });
        });

        describe('when the widget is invisible', () => {
          beforeEach(() => {
            mockZopim.livechat.window.getDisplay = () => false;
          });

          it('calls openApi', () => {
            pluckSubscribeCall(mockMediator, 'dave.toggle')();

            expect(openApiSpy).toHaveBeenCalled();
            expect(closeApiSpy).not.toHaveBeenCalled();
          });
        });
      });

      describe('<name>.hide', () => {
        it('should call zopim.livechat.hideAll()', () => {
          pluckSubscribeCall(mockMediator, 'dave.hide')();

          expect(mockZopim.livechat.hideAll)
            .toHaveBeenCalled();
        });

        it('should call zopim.livechat.mobileNotifications.setDisabled(true)', () => {
          pluckSubscribeCall(mockMediator, 'dave.hide')();

          expect(mockZopim.livechat.mobileNotifications.setDisabled)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('<name>.activate', () => {
        it('should call zopim.window.show()', () => {
          pluckSubscribeCall(mockMediator, 'dave.activate')();

          expect(mockZopim.livechat.window.show)
            .toHaveBeenCalled();
        });
      });
    });

    describe('init', () => {
      beforeEach(() => {
        mockZopim = mockRegistry['utility/globals'].win.$zopim;
      });

      describe('setPosition', () => {
        describe('when vertical position is top', () => {
          it('should set the vertical position', () => {
            mockVerticalPosition = 'top';
            chat.create('doge', { zopimId }, mockStore);
            chat.render('doge');

            expect(mockZopim.livechat.window.setPosition)
              .toHaveBeenCalledWith('tr');
          });
        });

        describe('when horizontal position setting is left', () => {
          it('should set the horizontal position', () => {
            mockHorizontalPosition = 'left';
            chat.create('doge', { zopimId }, mockStore);
            chat.render('doge');

            expect(mockZopim.livechat.window.setPosition)
              .toHaveBeenCalledWith('bl');
          });
        });
      });

      describe('setOffsetVertical', () => {
        it('should set the vertical offset', () => {
          mockOffsetVertical = 10;
          chat.create('doge', { zopimId }, mockStore);
          chat.render('doge');

          expect(mockZopim.livechat.window.setOffsetVertical)
            .toHaveBeenCalledWith(10);
        });
      });

      describe('when horizontal position setting is left', () => {
        it('should set the horizontal offset', () => {
          mockSettingsValue.margin = 8;
          mockOffsetHorizontal = 20;
          chat.create('doge', { zopimId }, mockStore);
          chat.render('doge');

          expect(mockZopim.livechat.window.setOffsetHorizontal)
            .toHaveBeenCalledWith(28);
        });
      });
    });
  });
});

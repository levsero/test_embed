describe('embed.chat', () => {
  let chat,
    mockIsMobileBrowserValue,
    mockRegistry,
    mockSettingsValue,
    mockZopim;

  const updateZopimChatStatusSpy = jasmine.createSpy('updateZopimChatStatus');
  const updateSettingsChatSuppressSpy = jasmine.createSpy('updateSettingsChatSuppress');
  const resetSettingsChatSuppressSpy = jasmine.createSpy('resetSettingsChatSuppress');
  const zopimEndChatSpy = jasmine.createSpy('zopimEndChat');
  const closeApiSpy = jasmine.createSpy('closeApi');
  const openApiSpy = jasmine.createSpy('openApi');

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
      'src/redux/modules/zopimChat': {
        updateZopimChatStatus: updateZopimChatStatusSpy,
        zopimOnClose: noop,
        zopimHide: noop,
        zopimConnectionUpdate: noop,
        zopimShow: noop,
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
      'src/redux/modules/settings': {
        updateSettingsChatSuppress: updateSettingsChatSuppressSpy,
        resetSettingsChatSuppress: resetSettingsChatSuppressSpy
      },
      'src/redux/modules/base': {
        updateActiveEmbed: noop
      },
      'src/service/api/apis': {
        closeApi: closeApiSpy,
        openApi: openApiSpy
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

      chat.create(chatName, {zopimId: zopimId});

      expect(chat.get(chatName).config.zopimId)
        .toEqual(zopimId);
    });

    it('should correctly parse the value for offsetHorizontal', () => {
      mockSettingsValue = {
        offset: { horizontal: 20 },
        margin: 15
      };

      chat.create('dave');

      expect(chat.get('dave').config.offsetHorizontal)
        .toEqual(35);
    });

    it('should correctly grab the value for offsetVertical', () => {
      mockSettingsValue = { offset: { vertical: '20px' } };

      chat.create('dave');

      expect(chat.get('dave').config.offsetVertical)
        .toEqual(20);
    });
  });

  describe('get', () => {
    it('should return the correct chat', () => {
      chat.create('dave');
      const dave = chat.get('dave');

      expect(dave)
        .toBeDefined();
    });
  });

  describe('render', () => {
    let mockMediator;
    const chatName = 'dave';
    const zopimId = 'abc123';

    it('should inject the zopim bootstrap script into the document', () => {
      mockMediator = mockRegistry['service/mediator'].mediator;
      chat.create(chatName, {zopimId: zopimId});
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
      chat.create(chatName, {zopimId: zopimId});
      chat.render(chatName);

      expect(mockZopim.livechat.mobileNotifications.setIgnoreChatButtonVisibility)
        .toHaveBeenCalled();
    });

    describe('zopim.endpoint', () => {
      describe('when the config does not exist', () => {
        const chatName = 'bob';
        const config = { zopimId: '123' };

        beforeEach(() => {
          chat.create(chatName, config);
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
          chat.create(chatName, config);
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
        chat.create(chatName, {zopimId: zopimId}, { dispatch: noop });
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

        it('calls updateSettingsChatSuppress with false', () => {
          expect(updateSettingsChatSuppressSpy)
            .toHaveBeenCalledWith(false);
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

        it('calls resetSettingsChatSuppress', () => {
          expect(resetSettingsChatSuppressSpy)
            .toHaveBeenCalled();
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
        chat.create(chatName, {zopimId: zopimId}, { dispatch: noop });
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

      it('should subscribe to chat.setUser', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('dave.setUser', jasmine.any(Function));
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
          chat.create('dave', { zopimId: zopimId, standalone: true }, { dispatch: noop });

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

      describe('<name>.setUser', () => {
        it('should call livechat.setName and livechat.setUser', () => {
          pluckSubscribeCall(mockMediator, 'dave.setUser')({
            name: 'david',
            email: 'david@email.com'
          });

          expect(mockZopim.livechat.setName)
            .toHaveBeenCalledWith('david');
          expect(mockZopim.livechat.setEmail)
            .toHaveBeenCalledWith('david@email.com');
        });

        it('should NOT call livechat.setName when user.name is missing', () => {
          pluckSubscribeCall(mockMediator, 'dave.setUser')({
            email: 'daniel@email.com'
          });

          expect(mockZopim.livechat.setEmail)
            .toHaveBeenCalledWith('daniel@email.com');
          expect(mockZopim.livechat.setName)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('init', () => {
      beforeEach(() => {
        mockZopim = mockRegistry['utility/globals'].win.$zopim;
      });

      describe('when position.vertical setting is defined', () => {
        it('should set the vertical position', () => {
          mockSettingsValue.position = { vertical: 'top' };
          chat.create('doge', { zopimId });
          chat.render('doge');

          expect(mockZopim.livechat.window.setPosition)
            .toHaveBeenCalledWith('tr');
        });
      });

      describe('when position.vertical setting is not defined', () => {
        it('should default the vertical position to bottom', () => {
          mockSettingsValue.position = {};
          chat.create('doge', { zopimId });
          chat.render('doge');

          expect(mockZopim.livechat.window.setPosition)
            .toHaveBeenCalledWith('br');
        });
      });

      describe('when position.horizontal setting is defined', () => {
        it('should set the horizontal position', () => {
          mockSettingsValue.position = { horizontal: 'left' };
          chat.create('doge', { zopimId });
          chat.render('doge');

          expect(mockZopim.livechat.window.setPosition)
            .toHaveBeenCalledWith('bl');
        });
      });

      describe('when position.horizontal setting is not defined', () => {
        it('should use the position in config', () => {
          mockSettingsValue.position = {};
          chat.create('doge', { zopimId, position: 'left' });
          chat.render('doge');

          expect(mockZopim.livechat.window.setPosition)
            .toHaveBeenCalledWith('bl');
        });
      });
    });
  });
});

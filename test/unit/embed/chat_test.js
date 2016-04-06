describe('embed.chat', function() {
  let chat,
    mockIsMobileBrowserValue,
    mockRegistry,
    mockSettingsValue,
    mockZopim;

  const mockGlobals = {
    document: global.document,
    win: {},
    getDocumentHost: function() {
      return document.body;
    }
  };
  const chatPath = buildSrcPath('embed/chat/chat');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockIsMobileBrowserValue = false;

    mockSettingsValue = { offset: { horizontal: 0, vertical: 0 } };

    mockZopim = function(fn) {
      return fn.bind(mockGlobals)();
    };

    mockZopim.livechat = {
      setOnStatus: jasmine.createSpy('setOnStatus'),
      setOnConnected: jasmine.createSpy('setOnConnected'),
      setOnUnreadMsgs: jasmine.createSpy('setOnUnreadMsgs'),
      setLanguage: jasmine.createSpy('setLanguage'),
      setOnChatEnd: jasmine.createSpy('setOnChatEnd'),
      hideAll: jasmine.createSpy('hideAll'),
      setSize: jasmine.createSpy('setSize'),
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
      'service/persistence': {
        store: jasmine.createSpyObj('store', ['set', 'get'])
      },
      'service/settings': {
        settings: {
          get: (name) => { return mockSettingsValue[name]; }
        }
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowserValue
      },
      'utility/globals': mockGlobals,
      'utility/utils': {
        cappedIntervalCall: () => {}
      }
    });

    mockery.registerAllowable(chatPath);
    chat = requireUncached(chatPath).chat;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', function() {
    it('should create and add a chat', function() {
      expect(_.keys(chat.list()).length)
        .toBe(0);

      chat.create('dave');

      expect(_.keys(chat.list()).length)
        .toBe(1);
    });

    it('should store the zopimId in config', function() {
      const chatName = 'dave';
      const zopimId = 'abc123';

      chat.create(chatName, {zopimId: zopimId});

      expect(chat.get(chatName).config.zopimId)
        .toEqual(zopimId);
    });

    it('should correctly parse the value for offsetHorizontal', function() {
      mockSettingsValue = {
        offset: { horizontal: '20px' },
        widgetMargin: 15
      };

      chat.create('dave');

      expect(chat.get('dave').config.offsetHorizontal)
        .toEqual(35);
    });

    it('should correctly grab the value for offsetVertical', function() {
      mockSettingsValue = { offset: { vertical: '20px' } };

      chat.create('dave');

      expect(chat.get('dave').config.offsetVertical)
        .toEqual('20px');
    });
  });

  describe('get', function() {
    it('should return the correct chat', function() {
      chat.create('dave');
      const dave = chat.get('dave');

      expect(dave)
        .toBeDefined();
    });
  });

  describe('render', function() {
    let mockMediator;
    const chatName = 'dave';
    const zopimId = 'abc123';

    it('should inject the zopim bootstrap script into the document', function() {
      mockMediator = mockRegistry['service/mediator'].mediator;
      chat.create(chatName, {zopimId: zopimId});
      chat.render(chatName);

      expect(document.querySelectorAll('body > script').length)
        .toEqual(1);

      const snippetText = document.querySelectorAll('body > script')[0].innerHTML;

      expect(snippetText.indexOf(zopimId))
        .not.toBe(false);
    });

    it('should call zopim.livechat.mobileNotifications.setIgnoreChatButtonVisibility()', function() {
      mockMediator = mockRegistry['service/mediator'].mediator;
      chat.create(chatName, {zopimId: zopimId});
      chat.render(chatName);

      expect(mockZopim.livechat.mobileNotifications.setIgnoreChatButtonVisibility)
        .toHaveBeenCalled();
    });

    describe('mediator broadcasts', function() {
      let mockZopim,
        onHideCall,
        onStatusCall,
        onUnreadMsgsCall,
        onChatEndCall;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        chat.create(chatName, {zopimId: zopimId});
        chat.render(chatName);

        mockZopim = mockRegistry['utility/globals'].win.$zopim;
        const livechat = mockZopim.livechat;

        onHideCall = livechat.window.onHide.calls.mostRecent();
        onUnreadMsgsCall = livechat.setOnUnreadMsgs.calls.mostRecent();
        onStatusCall = livechat.setOnStatus.calls.mostRecent();
        onChatEndCall = livechat.setOnChatEnd.calls.mostRecent();
      });

      describe('livechat.onHide', function() {
        it('should broadcast <name>.onHide', function() {
          onHideCall.args[0]();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onHide');
        });
      });

      describe('zopim.livechat.onStatus', function() {
        it('onStatus(online) should broadcast <name>.onOnline when agent is online', function() {
          chat.get(chatName).connected = true;

          onStatusCall.args[0]('online');

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onOnline');
        });

        it('onStatus(online) should broadcast <name>.onOnline when agent is away', function() {
          chat.get(chatName).connected = true;

          onStatusCall.args[0]('away');

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onOnline');
        });

        it('onStatus(offline) should broadcast <name>.onOffline when agent is offline', function() {
          chat.get(chatName).connected = true;

          onStatusCall.args[0]('offline');

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onOffline');
        });
      });

      describe('zopim.onUnreadMsgs', function() {
        it('should broadcast <name>.onUnreadMsgs regardless of count', function() {
          const count = Math.floor(Math.random() * 100);

          onUnreadMsgsCall.args[0](count);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onUnreadMsgs', count);
        });
      });

      describe('zopim.onChatEnd', function() {
        it('should broadcast <name>.onChatEnd', function() {
          onChatEndCall.args[0]();
          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onChatEnd');
        });
      });
    });

    describe('mediator subscriptions', function() {
      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        chat.create(chatName, {zopimId: zopimId});
        chat.render(chatName);
      });

      it('should subscribe to chat.show', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('dave.show', jasmine.any(Function));
      });

      it('should subscribe to chat.hide', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('dave.hide', jasmine.any(Function));
      });

      it('should subscribe to chat.activate', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('dave.activate', jasmine.any(Function));
      });

      describe('<name>.show', function() {
        it('should call zopim.button.show() if livechat window has not been opened', function() {
          pluckSubscribeCall(mockMediator, 'dave.show')();

          expect(mockZopim.livechat.button.show)
            .toHaveBeenCalled();
        });

        it('should call zopim.window.show() if livechat window is open', function() {
          mockZopim.livechat.window.show();

          pluckSubscribeCall(mockMediator, 'dave.show')();

          expect(mockZopim.livechat.window.show)
            .toHaveBeenCalled();
        });

        it('should call zopim.livechat.mobileNotifications.setDisabled(false)', function() {
          pluckSubscribeCall(mockMediator, 'dave.show')();

          expect(mockZopim.livechat.mobileNotifications.setDisabled)
            .toHaveBeenCalledWith(false);
        });
      });

      describe('<name>.hide', function() {
        it('should call zopim.livechat.hideAll()', function() {
          pluckSubscribeCall(mockMediator, 'dave.hide')();

          expect(mockZopim.livechat.hideAll)
            .toHaveBeenCalled();
        });

        it('should call zopim.livechat.mobileNotifications.setDiabled(true)', function() {
          pluckSubscribeCall(mockMediator, 'dave.hide')();

          expect(mockZopim.livechat.mobileNotifications.setDisabled)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('<name>.activate', function() {
        it('should call zopim.window.show()', function() {
          pluckSubscribeCall(mockMediator, 'dave.activate')();

          expect(mockZopim.livechat.window.show)
            .toHaveBeenCalled();
        });
      });
    });
  });
});

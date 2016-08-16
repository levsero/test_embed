describe('embed.chat', () => {
  let chat,
    mockIsMobileBrowserValue,
    mockRegistry,
    mockSettingsValue,
    mockZopim;

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
      'service/settings': {
        settings: {
          get: (name) => mockSettingsValue[name]
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

      expect(snippetText.indexOf(zopimId))
        .not.toBe(false);
    });

    it('should call zopim.livechat.mobileNotifications.setIgnoreChatButtonVisibility()', () => {
      mockMediator = mockRegistry['service/mediator'].mediator;
      chat.create(chatName, {zopimId: zopimId});
      chat.render(chatName);

      expect(mockZopim.livechat.mobileNotifications.setIgnoreChatButtonVisibility)
        .toHaveBeenCalled();
    });

    describe('mediator broadcasts', () => {
      let mockZopim,
        onHideCall,
        onStatusCall,
        onUnreadMsgsCall,
        onChatEndCall;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        mockZopim = mockRegistry['utility/globals'].win.$zopim;
        chat.create(chatName, {zopimId: zopimId});
        chat.render(chatName);

        const livechat = mockZopim.livechat;

        onHideCall = livechat.window.onHide.calls.mostRecent();
        onUnreadMsgsCall = livechat.setOnUnreadMsgs.calls.mostRecent();
        onStatusCall = livechat.setOnStatus.calls.mostRecent();
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

          it('should broadcast <name>.onOnline', () => {
            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('dave.onOnline');
          });
        });

        describe('when agent is away', () => {
          beforeEach(() => {
            onStatusCall.args[0]('away');
          });

          it('should broadcast <name>.onOnline', () => {
            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('dave.onOnline');
          });
        });

        describe('when agent is offline', () => {
          beforeEach(() => {
            onStatusCall.args[0]('offline');
          });

          it('should broadcast <name>.onOffline', () => {
            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('dave.onOffline');
          });
        });
      });

      describe('zopim.onUnreadMsgs', () => {
        it('should broadcast <name>.onUnreadMsgs regardless of count', () => {
          const count = Math.floor(Math.random() * 100);

          onUnreadMsgsCall.args[0](count);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onUnreadMsgs', count);
        });
      });

      describe('zopim.onChatEnd', () => {
        it('should broadcast <name>.onChatEnd', () => {
          onChatEndCall.args[0]();
          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onChatEnd');
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
        chat.create(chatName, {zopimId: zopimId});
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

      describe('<name>.show', () => {
        it('should call zopim.button.show() if livechat window has not been opened and it is standalone', () => {
          chat.create('dave', { zopimId: zopimId, standalone: true });

          pluckSubscribeCall(mockMediator, 'dave.show')();

          expect(mockZopim.livechat.button.show)
            .toHaveBeenCalled();
        });

        it('should call zopim.window.show() if livechat window is open', () => {
          mockZopim.livechat.window.show();

          pluckSubscribeCall(mockMediator, 'dave.show')();

          expect(mockZopim.livechat.window.show)
            .toHaveBeenCalled();
        });

        it('should call zopim.livechat.mobileNotifications.setDisabled(false)', () => {
          pluckSubscribeCall(mockMediator, 'dave.show')();

          expect(mockZopim.livechat.mobileNotifications.setDisabled)
            .toHaveBeenCalledWith(false);
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
  });
});

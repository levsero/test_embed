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
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowserValue
      },
      'utility/globals': mockGlobals,
      'utility/utils': {
        cappedIntervalCall: () => {}
      },
      'utility/color': {
        validSettingsColor: () => {}
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

describe('embed.chat', function() {
  var chat,
      mockRegistry,
      mockDevices = {
        isMobileBrowser: noop
      },
      mockZopim,
      mockGlobals = {
        document: global.document,
        win: {}
      },
      chatPath = buildSrcPath('embed/chat/chat');

  beforeEach(function() {
    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockZopim = function(fn) {
      return fn.bind(mockGlobals)();
    };

    mockZopim.livechat = {
      setOnStatus: jasmine.createSpy('setOnStatus'),
      setOnConnected: jasmine.createSpy('setOnConnected'),
      setOnUnreadMsgs: jasmine.createSpy('setOnUnreadMsgs'),
      setOnChatEnd: jasmine.createSpy('setOnChatEnd'),
      hideAll: jasmine.createSpy('hideAll'),
      isChatting: jasmine.createSpy('isChatting'),
      theme: {
        setColor: jasmine.createSpy('setColor'),
        setTheme: jasmine.createSpy('setTheme')
      },
      window: jasmine.createSpyObj('window', [
        'show',
        'setPosition',
        'setTitle',
        'setOffsetVertical',
        'onHide',
        'getDisplay'
      ])
    };

    mockGlobals.win.$zopim = mockZopim;

    mockRegistry = initMockRegistry({
      'utility/globals': mockGlobals,
      'utility/devices': mockDevices,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['init', 'setLocale', 't'])
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'imports?_=lodash!lodash': _
    });

    mockery.registerAllowable(chatPath);
    chat = require(chatPath).chat;
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
      var chatName = 'dave',
          zopimId = 'abc123';

      chat.create(chatName, {zopimId: zopimId});

      expect(chat.get(chatName).config.zopimId)
        .toEqual(zopimId);
    });

  });

  describe('get', function() {

    it('should return the correct chat', function() {
      var dave;

      chat.create('dave');
      dave = chat.get('dave');

      expect(dave)
        .toBeDefined();
    });
  });

  describe('render', function() {
    var chatName = 'alice',
        zopimId = 'abc123';

    beforeEach(function() {
      chat.create(chatName, {zopimId: zopimId});
      chat.render(chatName);
    });

    it('should inject the zopim bootstrap script into the document', function() {
      var snippetText;

      expect(document.querySelectorAll('body > script').length)
        .toEqual(1);

      snippetText = document.querySelectorAll('body > script')[0].innerHTML;

      expect(snippetText.indexOf(zopimId))
        .not.toBe(false);
    });

    describe('mediator broadcasts', function() {
      var mockMediator,
          mockZopim,
          onHideCall,
          onStatusCall,
          onUnreadMsgsCall,
          onChatEndCall;

      beforeEach(function() {
        var livechat;
        mockMediator = mockRegistry['service/mediator'].mediator;
        mockZopim = mockRegistry['utility/globals'].win.$zopim;
        livechat = mockZopim.livechat;

        onHideCall       = livechat.window.onHide.calls.mostRecent();
        onUnreadMsgsCall = livechat.setOnUnreadMsgs.calls.mostRecent();
        onStatusCall     = livechat.setOnStatus.calls.mostRecent();
        onChatEndCall    = livechat.setOnChatEnd.calls.mostRecent();
      });

      describe('livechat.onHide', function() {
        it('should broadcast <name>.onHide', function() {
          onHideCall.args[0]();
          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('alice.onHide');
        });
      });

      describe('zopim.livechat.onStatus', function() {
        it('onStatus(online) should broadcast <name>.onOnline', function() {
          chat.get(chatName).connected = true;

          onStatusCall.args[0]('online');
          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('alice.onOnline');
        });

        it('onStatus(offline) should broadcast <name>.onOffline', function() {
          chat.get(chatName).connected = true;

          onStatusCall.args[0]('offline');
          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('alice.onOffline');
        });
      });

      describe('zopim.onUnreadMsgs', function() {
        it('should broadcast <name>.onUnreadMsgs if count > 0', function() {
          onUnreadMsgsCall.args[0](1);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('alice.onUnreadMsgs', 1);
        });

        it('should broadcast <name>.onUnreadMsgs if count <= 0', function() {
          onUnreadMsgsCall.args[0](0);

          expect(mockMediator.channel.broadcast)
            .not.toHaveBeenCalled();
        });

      });

      describe('zopim.onChatEnd', function() {
        it('should broadcast <name>.onChatEnd', function() {
          onChatEndCall.args[0]();
          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('alice.onChatEnd');
        });

      });

    });

    describe('mediator subscriptions', function() {
      var mockMediator,
          pluckSubscribeCall = function(calls, key) {
            return _.find(calls, function(call) {
              return call[0] === key;
            })[1];
          },
          subscribeCalls;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator,
        subscribeCalls = mockMediator.channel.subscribe.calls.allArgs();
      });

      describe('<name>.show', function() {

        it('should call zopim.window.show()', function() {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('alice.show', jasmine.any(Function));

          pluckSubscribeCall(subscribeCalls, 'alice.show')();

          expect(mockZopim.livechat.window.show)
            .toHaveBeenCalled();
        });

      });

      describe('<name>.hide', function() {

        it('should call zopim.livechat.hideAll()', function() {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('alice.show', jasmine.any(Function));

          pluckSubscribeCall(subscribeCalls, 'alice.hide')();

          expect(mockZopim.livechat.hideAll)
            .toHaveBeenCalled();
        });

      });

    });

  });

});

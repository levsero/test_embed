describe('embed.chat', function() {
  var chat,
      mockRegistry,
      mockDevices = {
        isMobileBrowser: noop
      },
      mockZopim,
      mockGlobals = {
        document: global.document,
        win: {},
        getDocumentHost: function() {
          return document.body;
        }
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
        'onHide',
        'getDisplay',
        'setSize'
      ])
    };

    mockGlobals.win.$zopim = mockZopim;

    mockRegistry = initMockRegistry({
      'utility/globals': mockGlobals,
      'utility/devices': mockDevices,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['init', 'setLocale', 'getLocale', 't'])
      },
      'service/persistence': {
        store: jasmine.createSpyObj('store', ['set', 'get'])
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
    var chatName = 'dave',
        zopimId = 'abc123',
        mockMediator;

    beforeEach(function() {
      mockMediator = mockRegistry['service/mediator'].mediator;
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
      var mockZopim,
          onHideCall,
          onStatusCall,
          onUnreadMsgsCall,
          onChatEndCall,
          setTimeoutOrigin;

      beforeEach(function() {
        var livechat;
        mockZopim = mockRegistry['utility/globals'].win.$zopim;
        livechat = mockZopim.livechat;

        onHideCall       = livechat.window.onHide.calls.mostRecent();
        onUnreadMsgsCall = livechat.setOnUnreadMsgs.calls.mostRecent();
        onStatusCall     = livechat.setOnStatus.calls.mostRecent();
        onChatEndCall    = livechat.setOnChatEnd.calls.mostRecent();
        /*global setTimeout:true */
        setTimeoutOrigin = setTimeout;
        setTimeout       = function(fn) { fn.apply(); };
      });

      afterEach(function() {
        setTimeout = setTimeoutOrigin;
      });

      describe('livechat.onHide', function() {
        it('should broadcast <name>.onHide', function() {
          onHideCall.args[0]();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onHide');
        });
      });

      describe('zopim.livechat.onStatus', function() {

        it('onStatus(online) should broadcast <name>.onOnline', function() {
          chat.get(chatName).connected = true;

          onStatusCall.args[0]('online');

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onOnline');
        });

        it('onStatus(offline) should broadcast <name>.onOffline', function() {
          chat.get(chatName).connected = true;

          onStatusCall.args[0]('offline');

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onOffline');
        });

      });

      describe('zopim.onUnreadMsgs', function() {

        it('should broadcast <name>.onUnreadMsgs if count > 0', function() {
          onUnreadMsgsCall.args[0](1);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('dave.onUnreadMsgs', 1);
        });

        it('should not broadcast <name>.onUnreadMsgs if count <= 0', function() {
          onUnreadMsgsCall.args[0](0);

          expect(mockMediator.channel.broadcast)
            .not.toHaveBeenCalled();
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

      describe('<name>.show', function() {

        it('should call zopim.window.show()', function() {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('dave.show, dave.showWithAnimation', jasmine.any(Function));

          pluckSubscribeCall(mockMediator, 'dave.show, dave.showWithAnimation')();

          expect(mockZopim.livechat.window.show)
            .toHaveBeenCalled();
        });

      });

      describe('<name>.hide', function() {

        it('should call zopim.livechat.hideAll()', function() {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('dave.show, dave.showWithAnimation', jasmine.any(Function));

          pluckSubscribeCall(mockMediator, 'dave.hide')();

          expect(mockZopim.livechat.hideAll)
            .toHaveBeenCalled();
        });

      });

    });

  });

});

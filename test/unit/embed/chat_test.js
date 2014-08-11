describe('embed.chat', function() {
  var chat,
      mockRegistry,
      mockDevices = {
        isMobileBrowser: noop
      },
      mockGlobals = {
        document: global.document,
        win: {
          $zopim: noop
        }
      },
      chatPath = buildSrcPath('embed/chat/chat');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'util/globals': mockGlobals,
      'util/devices': mockDevices,
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

    it('should inject the zopim bootstrap script into the document', function() {
      var chatName = 'alice',
          zopimId = 'abc123',
          snippetText;

      chat.create(chatName, {zopimId: zopimId});

      chat.render(chatName);

      expect(document.querySelectorAll('body > script').length)
        .toEqual(1);

      snippetText = document.querySelectorAll('body > script')[0].innerHTML;

      expect(snippetText.indexOf(zopimId))
        .not.toBe(false);
    });
  });

  describe('show', function() {

    it('should call the configs onShow', function() {
      var mockConfig = {
        zopimId: 'abc123',
        onShow: jasmine.createSpy()
      };

      chat.create('dave', mockConfig);

      chat.render('dave');
      chat.show('dave');

      expect(mockConfig.onShow)
        .toHaveBeenCalled();
    });
  });

  describe('hide', function() {

    it('should call the configs onHide', function() {
      var mockConfig = {
        zopimId: 'abc123',
        onHide: jasmine.createSpy()
      };

      chat.create('dave', mockConfig);

      chat.render('dave');
      chat.hide('dave');

      expect(mockConfig.onHide)
        .toHaveBeenCalled();
    });
  });
});

describe('embed.chat', function() {
  var chat,
      mockGlobals = {
        document: global.document
      },
      chatPath = buildPath('embed/chat/chat');

  beforeEach(function() {
    resetDOM();

    mockery.enable();
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('imports?_=lodash!lodash', _);
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

      chat.create('chat1');

      expect(_.keys(chat.list()).length)
        .toBe(1);
    });

    it('should store the zopimId in config', function() {
      var chatName = 'alice',
          zopimId = 'abc123';

      chat.create(chatName, {zopimId: zopimId});

      expect(chat.get(chatName).config.zopimId)
        .toEqual(zopimId);
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
      
      expect(snippetText.indexOf(zopimId)).not.toBe(false);
    });
  });
});

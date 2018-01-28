describe('ChatReconnectionBubble component', () => {
  let ChatReconnectionBubble,
    mocki18nTranslate;
  const chatReconnectionBubblePath = buildSrcPath('component/chat/ChatReconnectionBubble');

  beforeEach(() => {
    mockery.enable();
    mocki18nTranslate = jasmine.createSpy('i18nTranslate');

    initMockRegistry({
      'React': React,
      './ChatReconnectionBubble.scss': {
        locals: ''
      },
      'component/loading/LoadingSpinner': { LoadingSpinner: noopReactComponent() },
      'service/i18n': { i18n: { t: mocki18nTranslate } }
    });

    mockery.registerAllowable(chatReconnectionBubblePath);
    ChatReconnectionBubble = requireUncached(chatReconnectionBubblePath).ChatReconnectionBubble;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    beforeEach(() => {
      domRender(<ChatReconnectionBubble />);
    });

    it('uses correct translation for title with `Reconnecting` fallback', () => {
      expect(mocki18nTranslate)
        .toHaveBeenCalledWith(
          'embeddable_framework.chat.reconnecting.title',
          { fallback: 'Reconnecting' }
        );
    });
  });
});

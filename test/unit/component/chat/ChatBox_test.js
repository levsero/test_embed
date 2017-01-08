describe('ChatBox component', () => {
  let ChatBox;
  const chatBoxPath = buildSrcPath('component/chat/ChatBox');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatBox.sass': {
        locals: {}
      },
      'component/button/ButtonSecondary': {
        ButtonSecondary: noopReactComponent()
      },
      'component/field/Field': {
        Field: noopReactComponent()
      },
      'service/i18n': {
        i18n: { t: noop }
      }
    });

    mockery.registerAllowable(chatBoxPath);
    ChatBox = requireUncached(chatBoxPath).ChatBox;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleChange', () => {
    let component, updateCurrentMsgSpy;

    beforeEach(() => {
      updateCurrentMsgSpy = jasmine.createSpy();
      component = domRender(<ChatBox updateCurrentMsg={updateCurrentMsgSpy} />);

      component.handleChange({ target: { value: '!' } });
    });

    it('calls updateCurrentMsg prop', () => {
      expect(updateCurrentMsgSpy)
        .toHaveBeenCalledWith('!');
    });
  });

  describe('handleSendClick', () => {
    let component, updateCurrentMsgSpy, sendMsgSpy;

    beforeEach(() => {
      updateCurrentMsgSpy = jasmine.createSpy();
      sendMsgSpy = jasmine.createSpy();
      component = domRender(
        <ChatBox
          currentMessage='Hello!'
          updateCurrentMsg={updateCurrentMsgSpy}
          sendMsg={sendMsgSpy} />);

      component.handleChange({ target: { value: 'Hello!' } });
      component.handleSendClick();
    });

    it('clears updateCurrentMsg prop', () => {
      expect(updateCurrentMsgSpy)
        .toHaveBeenCalledWith('');
    });

    it('calls sendMsg prop', () => {
      expect(sendMsgSpy)
        .toHaveBeenCalledWith('Hello!');
    });
  });
});


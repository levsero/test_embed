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
      },
      'utility/keyboard': {
        keyCodes: {
          'a': 65,
          'ENTER': 13
        }
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

  describe('handleKeyDown', () => {
    let component, updateCurrentMsgSpy, sendMsgSpy;
    let event = { keyCode: 13, preventDefault: () => { return false; }};

    beforeEach(() => {
      updateCurrentMsgSpy = jasmine.createSpy();
      sendMsgSpy = jasmine.createSpy();
      component = domRender(
        <ChatBox
          currentMessage='Hello!'
          updateCurrentMsg={updateCurrentMsgSpy}
          sendMsg={sendMsgSpy} />);
    });

    describe('when the user presses <Enter>', () => {
      describe('when shift is _not_ pressed simultaneously', () => {
        it('interprets it as a send signal and sends the message', () => {
          component.handleKeyDown(event);

          expect(sendMsgSpy)
            .toHaveBeenCalledWith('Hello!');
        });
      });

      describe('when shift _is_ pressed simultaneously', () => {
        it('does not send the message and enters a line break', () => {
          event = _.merge(event, { shiftKey: true });
          component.handleKeyDown(event);

          expect(sendMsgSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when the user presses any other key', () =>{
      it('does not send the message', () => {
        event = _.merge(event, { keyCode: 65 });
        component.handleKeyDown(event);

        expect(sendMsgSpy)
          .not.toHaveBeenCalled();
      });
    });
  });
});

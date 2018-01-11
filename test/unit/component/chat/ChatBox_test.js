describe('ChatBox component', () => {
  let ChatBox;
  const chatBoxPath = buildSrcPath('component/chat/ChatBox');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatBox.scss': {
        locals: {}
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
      updateCurrentMsgSpy = jasmine.createSpy('updateCurrentMsg');
      sendMsgSpy = jasmine.createSpy('sendMsg');
    });

    describe('when currentMessage is empty', () => {
      beforeEach(() => {
        component = domRender(
          <ChatBox
            currentMessage=''
            updateCurrentMsg={updateCurrentMsgSpy}
            sendMsg={sendMsgSpy} />);

        component.handleSendClick();
      });

      it('does not call updateCurrentMsg prop', () => {
        expect(updateCurrentMsgSpy)
          .not.toHaveBeenCalled();
      });

      it('does not call sendMsg prop', () => {
        expect(sendMsgSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when currentMessage is not empty', () => {
      beforeEach(() => {
        component = domRender(
          <ChatBox
            currentMessage='Hello!'
            updateCurrentMsg={updateCurrentMsgSpy}
            sendMsg={sendMsgSpy} />);

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

  describe('handleKeyDown', () => {
    const keyCodes = { enter: 13, a: 65 };
    let component, updateCurrentMsgSpy, sendMsgSpy;
    let event = { keyCode: keyCodes.enter, preventDefault: () => false };

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
        event = _.merge(event, { keyCode: keyCodes.a });
        component.handleKeyDown(event);

        expect(sendMsgSpy)
          .not.toHaveBeenCalled();
      });
    });
  });
});

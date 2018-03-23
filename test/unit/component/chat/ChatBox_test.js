describe('ChatBox component', () => {
  let ChatBox;
  const chatBoxPath = buildSrcPath('component/chat/ChatBox');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatBox.scss': {
        locals: {
          label: 'label',
          fieldMobile: 'fieldMobile',
          input: 'input',
          inputMobile: 'inputMobile'
        }
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
      component = instanceRender(<ChatBox handleChatBoxChange={updateCurrentMsgSpy} />);

      component.handleChange({ target: { value: '!' } });
    });

    it('calls handleChatBoxChange prop', () => {
      expect(updateCurrentMsgSpy)
        .toHaveBeenCalledWith('!');
    });
  });

  describe('handleKeyDown', () => {
    const keyCodes = { enter: 13, a: 65 };
    let component, sendChatSpy;
    let event = { keyCode: keyCodes.enter, preventDefault: () => false };

    beforeEach(() => {
      sendChatSpy = jasmine.createSpy();
      component = instanceRender(<ChatBox sendChat={sendChatSpy} />);
    });

    describe('when the user presses <Enter>', () => {
      describe('when shift is _not_ pressed simultaneously', () => {
        it('interprets it as a send signal and sends the message', () => {
          component.handleKeyDown(event);

          expect(sendChatSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when shift _is_ pressed simultaneously', () => {
        it('does not send the message and enters a line break', () => {
          event = _.merge(event, { shiftKey: true });
          component.handleKeyDown(event);

          expect(sendChatSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when the user presses any other key', () =>{
      it('does not send the message', () => {
        event = _.merge(event, { keyCode: keyCodes.a });
        component.handleKeyDown(event);

        expect(sendChatSpy)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('chatBoxTextarea', () => {
    let component;

    describe('on non-mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChatBox isMobile={false} />);
      });

      it('has 2 rows', () => {
        expect(component.chatBoxTextarea().props.rows)
          .toBe(2);
      });
    });

    describe('on mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChatBox isMobile={true} />);
      });

      it('has 1 row', () => {
        expect(component.chatBoxTextarea().props.rows)
          .toBe(1);
      });
    });
  });

  describe('Field component', () => {
    let component, field;

    describe('on non-mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChatBox isMobile={false} />);
        field = component.render().props.children;
      });

      it('passes correct classnames to Field', () => {
        expect(field.props.labelClasses)
          .toContain('label');
        expect(field.props.fieldClasses)
          .not.toContain('fieldMobile');
        expect(field.props.inputClasses)
          .toContain('input');
        expect(field.props.inputClasses)
          .not.toContain('inputMobile');
      });
    });

    describe('on mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChatBox isMobile={true} />);
        field = component.render().props.children;
      });

      it('passes correct classnames to Field', () => {
        expect(field.props.labelClasses)
          .toContain('label');
        expect(field.props.fieldClasses)
          .toContain('fieldMobile');
        expect(field.props.inputClasses)
          .toContain('input inputMobile');
      });
    });
  });
});

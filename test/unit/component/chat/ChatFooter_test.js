describe('ChatFooter component', () => {
  let ChatFooter;
  const chatFooterPath = buildSrcPath('component/chat/ChatFooter');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatFooter.scss': {
        locals: {
          iconContainer: 'iconsClass',
          containerMobile: 'containerMobileClass',
          iconEndChat: 'iconEndChatClass',
          iconDisabled: 'iconDisabledClasses',
          iconAttachment: 'iconAttachmentClass',
          iconAttachmentMobile: 'iconAttachmentMobileClass',
          iconMenu: 'iconMenuClass',
          iconSendChat: 'iconSendChatClass',
          iconSendChatMobile: 'iconSendChatMobileClass'
        }
      },
      'component/Dropzone': {
        Dropzone: noopReactComponent()
      },
      'component/Icon': {
        Icon: noopReactComponent()
      }
    });

    mockery.registerAllowable(chatFooterPath);
    ChatFooter = requireUncached(chatFooterPath).ChatFooter;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component, componentNode;

    describe('icons', () => {
      beforeEach(() => {
        component = domRender(<ChatFooter />);
        componentNode = ReactDOM.findDOMNode(component);
      });

      it('renders the chat footer with styled icons', () => {
        expect(componentNode.querySelector('.iconsClass'))
          .toBeTruthy();
      });
    });

    describe('on non-mobile devices', () => {
      let result;

      beforeEach(() => {
        component = domRender(<ChatFooter isMobile={false} />);
        result = component.render();
      });

      it('renders the desktop version', () => {
        expect(result.props.className)
          .not.toContain('containerMobileClass');
      });
    });

    describe('on mobile devices', () => {
      let result;

      beforeEach(() => {
        component = domRender(<ChatFooter isMobile={true} />);
        result = component.render();
      });

      it('renders the mobile version', () => {
        expect(result.props.className)
          .toContain('containerMobileClass');
      });
    });
  });

  describe('renderEndChatOption', () => {
    let result;

    describe('when props.isChatting is false', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatFooter isChatting={false} />);

        result = component.renderEndChatOption();
      });

      it('has disabled classes', () => {
        expect(result.props.className)
          .toContain('iconEndChatClass');
        expect(result.props.className)
          .toContain('iconDisabledClasses');
      });
    });

    describe('when props.isChatting is true', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatFooter isChatting={true} />);

        result = component.renderEndChatOption();
      });

      it('does not have disabled classes', () => {
        expect(result.props.className)
          .toContain('iconEndChatClass');
        expect(result.props.className)
          .not.toContain('iconDisabledClasses');
      });
    });
  });

  describe('renderAttachmentOption', () => {
    let result;

    describe('when props.attachmentsEnabled is true', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatFooter attachmentsEnabled={true} />);

        result = component.renderAttachmentOption();
      });

      it('returns the attachment option', () => {
        expect(result)
          .toBeTruthy();
      });
    });

    describe('when props.attachmentsEnabled is false', () => {
      beforeEach(() => {
        const component = instanceRender(<ChatFooter attachmentsEnabled={false} />);

        result = component.renderAttachmentOption();
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('on non-mobile devices', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatFooter attachmentsEnabled={true} isMobile={false} />
        );

        result = component.renderAttachmentOption();
      });

      it('does not have mobile specific classes', () => {
        expect(result.props.className)
          .toContain('iconAttachmentClass');
        expect(result.props.className)
          .not.toContain('iconAttachmentMobileClass');
      });
    });

    describe('on mobile devices', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChatFooter attachmentsEnabled={true} isMobile={true} />
        );

        result = component.renderAttachmentOption();
      });

      it('has mobile specific classes', () => {
        expect(result.props.className)
          .toContain('iconAttachmentClass');
        expect(result.props.className)
          .toContain('iconAttachmentMobileClass');
      });
    });
  });

  describe('renderMenuOption', () => {
    let result;

    beforeEach(() => {
      const component = instanceRender(<ChatFooter />);

      result = component.renderMenuOption();
    });

    it('has correct classes', () => {
      expect(result.props.className)
        .toContain('iconMenuClass');
    });
  });

  describe('renderSendChatOption', () => {
    let result, sendChatSpy;

    beforeEach(() => {
      sendChatSpy = jasmine.createSpy();
      const component = instanceRender(<ChatFooter sendChat={sendChatSpy} />);

      result = component.renderSendChatOption();
    });

    it('has correct classes', () => {
      expect(result.props.className)
        .toContain('iconSendChatClass iconSendChatMobileClass');
    });

    it('passes sendChat to onClick handler', () => {
      expect(result.props.onClick)
        .toBe(sendChatSpy);
    });
  });

  describe('handleMenuClick', () => {
    let component, stopPropagationSpy, toggleMenuSpy;

    beforeEach(() => {
      stopPropagationSpy = jasmine.createSpy();
      toggleMenuSpy = jasmine.createSpy();

      component = domRender(<ChatFooter showIcons={true} toggleMenu={toggleMenuSpy} />);
      component.handleMenuClick({ stopPropagation: stopPropagationSpy });
    });

    it('calls stopPropagation on the event', () => {
      expect(stopPropagationSpy)
        .toHaveBeenCalled();
    });

    it('calls props.toggleMenu', () => {
      expect(toggleMenuSpy)
        .toHaveBeenCalled();
    });
  });

  describe('handleEndChatClick', () => {
    let component, endChatSpy;

    beforeEach(() => {
      endChatSpy = jasmine.createSpy();
    });

    describe('when props.isChatting is false', () => {
      beforeEach(() => {
        component = domRender(<ChatFooter isChatting={false} endChat={endChatSpy} />);

        component.handleEndChatClick('some event');
      });

      it('does not call props.endChat', () => {
        expect(endChatSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when props.isChatting is true', () => {
      beforeEach(() => {
        component = domRender(<ChatFooter isChatting={true} endChat={endChatSpy} />);

        component.handleEndChatClick('some event');
      });

      it('calls props.endChat', () => {
        expect(endChatSpy)
          .toHaveBeenCalledWith('some event');
      });
    });
  });
});

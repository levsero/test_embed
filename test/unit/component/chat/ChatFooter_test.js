describe('ChatFooter component', () => {
  let ChatFooter;
  const chatFooterPath = buildSrcPath('component/chat/ChatFooter');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatFooter.scss': {
        locals: {
          icons: 'iconsClasses',
          iconDisabled: 'iconDisabledClasses',
          iconAttachmentDisabled: 'iconAttachmentDisabledClasses'
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
    let componentNode;

    beforeEach(() => {
      const component = domRender(<ChatFooter showIcons={true} />);

      componentNode = ReactDOM.findDOMNode(component);
    });

    it('renders the chat footer with styled icons', () => {
      expect(componentNode.querySelector('.iconsClasses'))
        .toBeTruthy();
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
  });

  describe('menuIconClick', () => {
    let component, stopPropagationSpy, toggleMenuSpy;

    beforeEach(() => {
      stopPropagationSpy = jasmine.createSpy();
      toggleMenuSpy = jasmine.createSpy();

      component = domRender(<ChatFooter showIcons={true} toggleMenu={toggleMenuSpy} />);
      component.menuIconClick({ stopPropagation: stopPropagationSpy });
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

        component.handleEndChatClick();
      });

      it('does not call props.endChat', () => {
        expect(endChatSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when props.isChatting is true', () => {
      beforeEach(() => {
        component = domRender(<ChatFooter isChatting={true} endChat={endChatSpy} />);

        component.handleEndChatClick();
      });

      it('calls props.endChat', () => {
        expect(endChatSpy)
          .toHaveBeenCalled();
      });
    });
  });
});

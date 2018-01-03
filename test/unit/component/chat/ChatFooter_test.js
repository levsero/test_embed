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

    describe('end chat icon', () => {
      let componentNode;

      describe('when props.isChatting is false', () => {
        beforeEach(() => {
          const component = domRender(<ChatFooter isChatting={false} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('has disabled classes', () => {
          expect(componentNode.querySelector('.iconDisabledClasses'))
            .toBeTruthy();
        });
      });

      describe('when props.isChatting is true', () => {
        beforeEach(() => {
          const component = domRender(<ChatFooter isChatting={true} />);

          componentNode = ReactDOM.findDOMNode(component);
        });

        it('does not have disabled classes', () => {
          expect(componentNode.querySelector('.iconDisabledClasses'))
            .toBeFalsy();
        });
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

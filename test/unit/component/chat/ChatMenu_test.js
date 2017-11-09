describe('ChatMenu component', () => {
  let ChatMenu;
  const chatMenuPath = buildSrcPath('component/chat/ChatMenu');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatMenu.sass': {
        locals: {}
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          t: (_, { fallback }) => fallback
        }
      }
    });

    mockery.registerAllowable(chatMenuPath);
    ChatMenu = requireUncached(chatMenuPath).ChatMenu;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleSoundClick', () => {
    let stopPropagationSpy, onSoundClickSpy;

    beforeEach(() => {
      onSoundClickSpy = jasmine.createSpy('handleSoundClick');
      stopPropagationSpy = jasmine.createSpy('stopPropagation');

      const component = domRender(<ChatMenu onSoundClick={onSoundClickSpy} />);

      component.handleSoundClick({ stopPropagation: stopPropagationSpy });
    });

    it('calls stopPropagation on the event', () => {
      expect(stopPropagationSpy)
        .toHaveBeenCalled();
    });

    it('calls props.onSoundClick', () => {
      expect(onSoundClickSpy)
        .toHaveBeenCalled();
    });
  });

  describe('props', () => {
    describe('disableEndChat', () => {
      let endChatButton;

      describe('when disable endChat is true', () => {
        beforeEach(() => {
          const component = domRender(<ChatMenu disableEndChat={true} />);
          const componentNode = ReactDOM.findDOMNode(component);

          endChatButton = componentNode.lastChild;
        });

        it('disables the end chat button', () => {
          expect(endChatButton.disabled)
            .toEqual(true);
        });
      });

      describe('when disable endChat is false', () => {
        beforeEach(() => {
          const component = domRender(<ChatMenu disableEndChat={false} />);
          const componentNode = ReactDOM.findDOMNode(component);

          endChatButton = componentNode.lastChild;
        });

        it('does not disable the end chat button', () => {
          expect(endChatButton.disabled)
            .toEqual(false);
        });
      });
    });

    describe('endChatOnClick', () => {
      let endChatOnClickSpy;

      describe('when the container has been clicked', () => {
        beforeEach(() => {
          endChatOnClickSpy = jasmine.createSpy();

          const component = domRender(<ChatMenu endChatOnClick={endChatOnClickSpy} />);
          const componentNode = ReactDOM.findDOMNode(component);

          componentNode.lastChild.click();
        });

        it('calls endChatOnClick', () => {
          expect(endChatOnClickSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when the container has not been clicked', () => {
        beforeEach(() => {
          endChatOnClickSpy = jasmine.createSpy();

          domRender(<ChatMenu endChatOnClick={endChatOnClickSpy} />);
        });

        it('does not call endChatOnClick', () => {
          expect(endChatOnClickSpy)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});

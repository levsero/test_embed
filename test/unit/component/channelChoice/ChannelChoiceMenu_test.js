describe('ChannelChoiceMenu component', () => {
  let ChannelChoiceMenu;

  const channelChoiceMenuPath = buildSrcPath('component/channelChoice/ChannelChoiceMenu');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      './ChannelChoiceMenu.sass': {
        locals: {
          chatBtnDisabled: 'chatBtnDisabled'
        }
      },
      'component/button/ButtonIcon': {
        ButtonIcon: class extends Component {
          render() {
            const { className, labelClassName } = this.props;

            return <div className={`${className} ${labelClassName}`} />;
          }
        }
      },
      'service/i18n': {
        i18n: {
          init: noop,
          setLocale: noop,
          isRTL: noop,
          t: _.identity
        }
      }
    });

    ChannelChoiceMenu = requireUncached(channelChoiceMenuPath).ChannelChoiceMenu;
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component, componentNode;

    beforeEach(() => {
      component = domRender(
        <ChannelChoiceMenu
          buttonClasses='ButtonClasses'
          labelClasses='LabelClasses' />
      );

      componentNode = ReactDOM.findDOMNode(component);
    });

    it('applies buttonClasses prop', () => {
      expect(componentNode.querySelector('.ButtonClasses'))
        .not.toBeNull();
    });

    it('applies labelClasses prop', () => {
      expect(componentNode.querySelector('.LabelClasses'))
        .not.toBeNull();
    });

    describe('when chatOnline is false', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            chatOnline={false} />
        );

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('should have chat disabled styles', () => {
        expect(componentNode.querySelector('.chatBtnDisabled'))
          .not.toBeNull();
      });
    });
  });

  describe('renderTalkButton', () => {
    let component;

    describe('when talk is available', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            talkAvailable={true} />
        );
      });

      it('returns a component', () => {
        expect(component.renderTalkButton())
          .not.toBeNull();
      });
    });

    describe('when talk is not available', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            talkAvailable={false} />
        );
      });

      it('returns null', () => {
        expect(component.renderTalkButton())
          .toBeNull();
      });
    });
  });

  describe('handleChatClick', () => {
    let component;

    describe('when chat is online', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            chatOnline={true} />
        );
        spyOn(component, 'handleNextClick');

        component.handleChatClick();
      });

      it('should call handleNextClick with `chat`', () => {
        expect(component.handleNextClick)
          .toHaveBeenCalledWith('chat');
      });
    });

    describe('when chat is offline', () => {
      let handler,
        stopPropagationSpy;

      beforeEach(() => {
        component = instanceRender(
          <ChannelChoiceMenu
            chatOnline={false} />
        );
        stopPropagationSpy = jasmine.createSpy('stopPropagation');
        spyOn(component, 'handleNextClick');

        handler = component.handleChatClick();
      });

      it('should not call handleNextClick', () => {
        expect(component.handleNextClick)
          .not.toHaveBeenCalled();
      });

      it('returns an anonymous function that calls e.stopPropagation', () => {
        handler({ stopPropagation: stopPropagationSpy });

        expect(stopPropagationSpy)
          .toHaveBeenCalled();
      });
    });
  });
});

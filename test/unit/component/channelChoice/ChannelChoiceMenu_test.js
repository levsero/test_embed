describe('ChannelChoiceMenu component', () => {
  let ChannelChoiceMenu;

  const channelChoiceMenuPath = buildSrcPath('component/channelChoice/ChannelChoiceMenu');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChannelChoiceMenu.scss': {
        locals: {
          chatBtnDisabled: 'chatBtnDisabled',
          talkBtnDisabled: 'talkBtnDisabled'
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
        i18n: { t: _.identity }
      }
    });

    ChannelChoiceMenu = requireUncached(channelChoiceMenuPath).ChannelChoiceMenu;
  });

  afterEach(() => {
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

    describe('when chatAvailable is false', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            chatAvailable={false}
            chatEnabled={true} />
        );

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('has chat disabled styles', () => {
        expect(componentNode.querySelector('.chatBtnDisabled'))
          .not.toBeNull();
      });
    });

    describe('when chatAvailable is true', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            chatEnabled={true}
            chatAvailable={true} />
        );

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('does not have chat disabled styles', () => {
        expect(componentNode.querySelector('.chatBtnDisabled'))
          .toBeNull();
      });
    });
  });

  describe('renderTalkButton', () => {
    let result;

    describe('when talk is enabled', () => {
      beforeEach(() => {
        const component = domRender(
          <ChannelChoiceMenu
            talkEnabled={true} />
        );

        result = component.renderTalkButton();
      });

      it('returns a component', () => {
        expect(result)
          .not.toBeNull();
      });

      describe('when callback is enabled', () => {
        beforeEach(() => {
          const component = domRender(
            <ChannelChoiceMenu
              talkAvailable={true}
              talkEnabled={true}
              callbackEnabled={true} />
          );

          result = component.renderTalkButton();
        });

        it('renders an element with "Request a callback" string', () => {
          expect(result.props.label)
            .toEqual('embeddable_framework.channelChoice.button.label.request_callback');
        });
      });

      describe('when callback is not enabled', () => {
        beforeEach(() => {
          const component = domRender(
            <ChannelChoiceMenu
              talkAvailable={true}
              talkEnabled={true}
              callbackEnabled={false} />
          );

          result = component.renderTalkButton();
        });

        it('renders an element with "Call us" string', () => {
          expect(result.props.label)
            .toEqual('embeddable_framework.channelChoice.button.label.call_us');
        });
      });

      describe('when talk is available', () => {
        beforeEach(() => {
          const component = domRender(
            <ChannelChoiceMenu
              talkAvailable={true}
              talkEnabled={true} />
          );

          result = component.renderTalkButton();
        });

        it('renders the component without disabled classes', () => {
          expect(result.props.className)
            .not.toContain('talkBtnDisabled');
        });

        it('renders the component with actionable prop as true', () => {
          expect(result.props.actionable)
            .toBe(true);
        });
      });

      describe('when talk is not available', () => {
        beforeEach(() => {
          const component = domRender(
            <ChannelChoiceMenu
              talkAvailable={false}
              talkEnabled={true} />
          );

          result = component.renderTalkButton();
        });

        it('renders the component with disabled classes', () => {
          expect(result.props.className)
            .toContain('talkBtnDisabled');
        });

        it('renders the component with actionable prop as false', () => {
          expect(result.props.actionable)
            .toBe(false);
        });
      });
    });

    describe('when talk is not enabled', () => {
      beforeEach(() => {
        const component = domRender(
          <ChannelChoiceMenu
            talkEnabled={false} />
        );

        result = component.renderTalkButton();
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('renderChatButton', () => {
    let component;

    describe('when chat is enabled', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            chatEnabled={true} />
        );
      });

      it('returns a component', () => {
        expect(component.renderChatButton())
          .not.toBeNull();
      });

      describe('when chat is available', () => {
        beforeEach(() => {
          component = domRender(
            <ChannelChoiceMenu
              chatAvailable={true}
              chatEnabled={true} />
          );
        });

        it('renders the component without disabled classes', () => {
          expect(component.renderChatButton().props.className)
            .not.toContain('chatBtnDisabled');
        });
      });

      describe('when chat is offline', () => {
        beforeEach(() => {
          component = domRender(
            <ChannelChoiceMenu
              chatEnabled={true}
              chatAvailable={false} />
          );
        });

        it('renders the component with disabled classes', () => {
          expect(component.renderChatButton().props.className)
            .toContain('chatBtnDisabled');
        });
      });
    });

    describe('when chat is not enabled', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            chatEnabled={false} />
        );
      });

      it('returns null', () => {
        expect(component.renderChatButton())
          .toBeNull();
      });
    });
  });

  describe('renderSubmitTicketButton', () => {
    let component;

    describe('when submit ticket is available', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            submitTicketAvailable={true} />
        );
      });

      it('returns a component', () => {
        expect(component.renderSubmitTicketButton())
          .not.toBeNull();
      });
    });

    describe('when submit ticket is not available', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            submitTicketAvailable={false} />
        );
      });

      it('returns null', () => {
        expect(component.renderSubmitTicketButton())
          .toBeNull();
      });
    });
  });

  describe('handleChatClick', () => {
    let component;

    describe('when chatAvailable is true', () => {
      beforeEach(() => {
        component = domRender(
          <ChannelChoiceMenu
            chatAvailable={true} />
        );
        spyOn(component, 'handleNextClick');

        component.handleChatClick();
      });

      it('calls handleNextClick with `chat`', () => {
        expect(component.handleNextClick)
          .toHaveBeenCalledWith('chat');
      });
    });

    describe('when chatAvailable is false', () => {
      let handler,
        stopPropagationSpy;

      beforeEach(() => {
        component = instanceRender(
          <ChannelChoiceMenu
            chatAvailable={false} />
        );
        stopPropagationSpy = jasmine.createSpy('stopPropagation');
        spyOn(component, 'handleNextClick');

        handler = component.handleChatClick();
      });

      it('does not call handleNextClick', () => {
        expect(component.handleNextClick)
          .not.toHaveBeenCalled();
      });

      it('returns an anonymous function that calls e.stopPropagation', () => {
        const mockEvent = { stopPropagation: stopPropagationSpy };

        handler(mockEvent);

        expect(stopPropagationSpy)
          .toHaveBeenCalled();
      });
    });
  });
});

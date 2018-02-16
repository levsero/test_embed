describe('ChatMenu component', () => {
  let ChatMenu;
  const chatMenuPath = buildSrcPath('component/chat/ChatMenu');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatMenu.scss': {
        locals: {}
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'component/transition/SlideUpAppear': {
        SlideUpAppear: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          t: noop
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

    describe('isChatting', () => {
      let component, response;

      describe('when isChatting is true', () => {
        beforeEach(() => {
          component = domRender(<ChatMenu isChatting={true} />);
          response = component.renderEmailTranscriptButton();
        });

        it('shows email transcript button', () => {
          expect(response.type)
            .toEqual('button');
        });
      });

      describe('when isChatting is false', () => {
        beforeEach(() => {
          component = domRender(<ChatMenu isChatting={false} />);
          response = component.renderEmailTranscriptButton();
        });

        it('does not show email transcript button', () => {
          expect(response)
            .toEqual(null);
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

    describe('contactDetailsOnClick', () => {
      let contactDetailsOnClickSpy;

      describe('when the container has been clicked', () => {
        beforeEach(() => {
          contactDetailsOnClickSpy = jasmine.createSpy();

          const component = domRender(<ChatMenu contactDetailsOnClick={contactDetailsOnClickSpy} />);
          const componentNode = ReactDOM.findDOMNode(component);

          componentNode.children[2].click();
        });

        it('calls contactDetailsOnClick', () => {
          expect(contactDetailsOnClickSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when the container has not been clicked', () => {
        beforeEach(() => {
          contactDetailsOnClickSpy = jasmine.createSpy();

          domRender(<ChatMenu contactDetailsOnClick={contactDetailsOnClickSpy} />);
        });

        it('does not call contactDetailsOnClick', () => {
          expect(contactDetailsOnClickSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('emailTranscriptOnClick', () => {
      let emailTranscriptOnClickSpy;

      describe('when the container has been clicked', () => {
        beforeEach(() => {
          emailTranscriptOnClickSpy = jasmine.createSpy();

          const component = domRender(<ChatMenu emailTranscriptOnClick={emailTranscriptOnClickSpy} isChatting={true} />);
          const componentNode = ReactDOM.findDOMNode(component);

          componentNode.children[2].click();
        });

        it('calls emailTranscriptOnClick', () => {
          expect(emailTranscriptOnClickSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when the container has not been clicked', () => {
        beforeEach(() => {
          emailTranscriptOnClickSpy = jasmine.createSpy();

          domRender(<ChatMenu emailTranscriptOnClick={emailTranscriptOnClickSpy} isChatting={true} />);
        });

        it('does not call contactDetailsOnClick', () => {
          expect(emailTranscriptOnClickSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('playSound', () => {
      let component, response;

      describe('when playSound is true', () => {
        beforeEach(() => {
          component = domRender(<ChatMenu playSound={true} />);
          response = component.renderSoundButton();
        });

        it('iconType should be Icon--sound-on', () => {
          expect(response.props.children[1].props.type)
            .toEqual('Icon--sound-on');
        });
      });

      describe('when playSound is true', () => {
        beforeEach(() => {
          component = domRender(<ChatMenu playSound={false} />);
          response = component.renderSoundButton();
        });

        it('iconType should be Icon--sound-off', () => {
          expect(response.props.children[1].props.type)
            .toEqual('Icon--sound-off');
        });
      });
    });
  });
});

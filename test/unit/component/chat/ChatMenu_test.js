describe('ChatMenu component', () => {
  let ChatMenu;
  const chatMenuPath = buildSrcPath('component/chat/ChatMenu');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatMenu.scss': {
        locals: {
          itemMobile: 'itemMobileClass',
          item: 'itemClass',
          container: 'containerClass',
          containerMobile: 'containerMobileClass'
        }
      },
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/Dropzone': {
        Dropzone: noopReactComponent()
      },
      'component/transition/SlideAppear': {
        SlideAppear: noopReactComponent()
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

      const component = instanceRender(<ChatMenu onSoundClick={onSoundClickSpy} />);

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

  describe('preventContainerClick', () => {
    let stopPropagationSpy;

    beforeEach(() => {
      stopPropagationSpy = jasmine.createSpy('stopPropagation');

      const component = instanceRender(<ChatMenu />);

      component.preventContainerClick({ stopPropagation: stopPropagationSpy });
    });

    it('calls stopPropagation on the event', () => {
      expect(stopPropagationSpy)
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
          component = instanceRender(<ChatMenu isChatting={true} />);
          response = component.renderEmailTranscriptButton();
        });

        it('shows email transcript button', () => {
          expect(response.type)
            .toEqual('button');
        });

        describe('when isMobile is true', () => {
          beforeEach(() => {
            component = instanceRender(<ChatMenu isMobile={true} isChatting={true} />);
            response = component.renderEmailTranscriptButton();
          });

          it('uses mobile styles', () => {
            expect(response.props.className)
              .toEqual('itemMobileClass');
          });
        });

        describe('when isMobile is false', () => {
          beforeEach(() => {
            component = instanceRender(<ChatMenu isMobile={false} isChatting={true} />);
            response = component.renderEmailTranscriptButton();
          });

          it('uses desktop styles', () => {
            expect(response.props.className)
              .toEqual('itemClass');
          });
        });
      });

      describe('when isChatting is false', () => {
        beforeEach(() => {
          component = instanceRender(<ChatMenu isChatting={false} />);
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

          instanceRender(<ChatMenu endChatOnClick={endChatOnClickSpy} />);
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

          instanceRender(<ChatMenu contactDetailsOnClick={contactDetailsOnClickSpy} />);
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

          instanceRender(<ChatMenu emailTranscriptOnClick={emailTranscriptOnClickSpy} isChatting={true} />);
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
          component = instanceRender(<ChatMenu playSound={true} />);
          response = component.renderSoundButton();
        });

        it('iconType should be Icon--sound-on', () => {
          expect(response.props.children[1].props.type)
            .toEqual('Icon--sound-on');
        });
      });

      describe('when playSound is true', () => {
        beforeEach(() => {
          component = instanceRender(<ChatMenu playSound={false} />);
          response = component.renderSoundButton();
        });

        it('iconType should be Icon--sound-off', () => {
          expect(response.props.children[1].props.type)
            .toEqual('Icon--sound-off');
        });
      });

      describe('when isMobile is true', () => {
        beforeEach(() => {
          component = instanceRender(<ChatMenu isMobile={true} />);
          response = component.renderSoundButton();
        });

        it('uses mobile styles', () => {
          expect(response.props.className)
            .toEqual('itemMobileClass');
        });
      });

      describe('when isMobile is false', () => {
        beforeEach(() => {
          component = instanceRender(<ChatMenu isMobile={false} />);
          response = component.renderSoundButton();
        });

        it('uses desktop styles', () => {
          expect(response.props.className)
            .toEqual('itemClass');
        });
      });
    });

    describe('attachmentsEnabled', () => {
      let component, response;

      describe('when attachmentsEnabled is true', () => {
        beforeEach(() => {
          component = instanceRender(<ChatMenu attachmentsEnabled={true} />);
          response = component.renderSendFileButton();
        });

        it('shows button', () => {
          expect(response.type)
            .toEqual('div');
        });
      });

      describe('when attachmentsEnabled is false', () => {
        beforeEach(() => {
          component = instanceRender(<ChatMenu attachmentsEnabled={false} />);
          response = component.renderSendFileButton();
        });

        it('does not show button', () => {
          expect(response)
            .toBeNull();
        });
      });

      describe('when isMobile is true', () => {
        beforeEach(() => {
          component = instanceRender(<ChatMenu attachmentsEnabled={true} isMobile={true} />);
          response = component.renderSendFileButton();
        });

        it('uses mobile styles', () => {
          expect(response.props.children.props.className)
            .toEqual('itemMobileClass');
        });
      });

      describe('when isMobile is false', () => {
        beforeEach(() => {
          component = instanceRender(<ChatMenu attachmentsEnabled={true} isMobile={false} />);
          response = component.renderSendFileButton();
        });

        it('uses desktop styles', () => {
          expect(response.props.children.props.className)
            .toEqual('itemClass');
        });
      });
    });
  });

  describe('desktop', () => {
    let response,
      buttons,
      emailTranscriptOnClickSpy,
      contactDetailsOnClickSpy,
      endChatOnClickSpy;

    beforeEach(() => {
      emailTranscriptOnClickSpy = jasmine.createSpy('emailTranscriptOnClick');
      contactDetailsOnClickSpy = jasmine.createSpy('contactDetailsOnClick');
      endChatOnClickSpy = jasmine.createSpy('endChatOnClick');

      const component = instanceRender(
        <ChatMenu
          isChatting={true}
          emailTranscriptOnClick={emailTranscriptOnClickSpy}
          contactDetailsOnClick={contactDetailsOnClickSpy}
          endChatOnClick={endChatOnClickSpy}
        />);

      response = component.render();
      buttons = response.props.children;
    });

    it('renders the expected container class', () => {
      expect(response.props.className)
        .toEqual('containerClass');
    });

    it('renders sound button as first item', () => {
      expect(buttons[0].props.children[1].props.type)
        .toEqual('Icon--sound-off');
    });

    it('renders email transcript button as third item with the expected style', () => {
      const emailTranscript = buttons[2];

      expect(emailTranscript.props.onClick)
        .toEqual(emailTranscriptOnClickSpy);

      expect(emailTranscript.props.className)
        .toEqual('itemClass');
    });

    it('renders contact details button as fourth item with the expected style', () => {
      const contactDetails = buttons[3];

      expect(contactDetails.props.onClick)
        .toEqual(contactDetailsOnClickSpy);

      expect(contactDetails.props.className)
        .toEqual('itemClass');
    });

    it('renders end chat button as sixth item with the expected style', () => {
      const endChat = buttons[5];

      expect(endChat.props.onClick)
        .toEqual(endChatOnClickSpy);

      expect(endChat.props.className)
        .toEqual('itemClass');
    });
  });

  describe('mobile', () => {
    let component,
      response,
      buttons,
      goBackClickSpy,
      contactDetailsOnClickSpy,
      emailTranscriptOnClickSpy,
      endChatOnClickSpy;

    beforeEach(() => {
      goBackClickSpy = jasmine.createSpy('goBackClick');
      contactDetailsOnClickSpy = jasmine.createSpy('contactDetailsOnClick');
      emailTranscriptOnClickSpy = jasmine.createSpy('emailTranscriptOnClick');
      endChatOnClickSpy = jasmine.createSpy('endChatOnClick');

      component = instanceRender(
        <ChatMenu
          isMobile={true}
          attachmentsEnabled={true}
          isChatting={true}
          contactDetailsOnClick={contactDetailsOnClickSpy}
          emailTranscriptOnClick={emailTranscriptOnClickSpy}
          endChatOnClick={endChatOnClickSpy}
          onGoBackClick={goBackClickSpy}
        />);

      response = component.render();

      buttons = response.props.children[1].props.children;
    });

    it('renders the expected container class', () => {
      expect(response.props.className)
        .toContain('containerMobileClass');
    });

    it('renders go back button as first item with expected style', () => {
      const goBack = buttons[0];

      expect(goBack.props.onClick)
        .toEqual(goBackClickSpy);

      expect(goBack.props.className)
        .toEqual('itemMobileClass');
    });

    it('renders go back button as first item with expected style', () => {
      const goBack = buttons[0];

      expect(goBack.props.onClick)
        .toEqual(goBackClickSpy);

      expect(goBack.props.className)
        .toEqual('itemMobileClass');
    });

    it('renders contact details button as second item with the expected style', () => {
      const contactDetails = buttons[1];

      expect(contactDetails.props.onClick)
        .toEqual(contactDetailsOnClickSpy);

      expect(contactDetails.props.className)
        .toEqual('itemMobileClass');
    });

    it('renders send file button as third item with the expected style', () => {
      const sendFile = buttons[2];

      expect(sendFile.props.onClick)
        .toEqual(component.preventContainerClick);

      expect(sendFile.props.children.props.className)
        .toEqual('itemMobileClass');
    });

    it('renders email transcript button as fourth item with the expected style', () => {
      const emailTranscript = buttons[3];

      expect(emailTranscript.props.onClick)
        .toEqual(emailTranscriptOnClickSpy);

      expect(emailTranscript.props.className)
        .toEqual('itemMobileClass');
    });

    it('renders end chat button as fifth item with the expected style', () => {
      const endChat = buttons[4];

      expect(endChat.props.onClick)
        .toEqual(component.preventContainerClick);

      expect(endChat.props.children.props.onClick)
        .toEqual(endChatOnClickSpy);

      expect(endChat.props.className)
        .toEqual('itemMobileClass');
    });
  });
});

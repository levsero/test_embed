describe('ChatMenu component', () => {
  let ChatMenu;
  const chatMenuPath = buildSrcPath('component/chat/ChatMenu');
  const SlideAppear = noopReactComponent('SlideAppear');
  const Icon = noopReactComponent('Icon');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './ChatMenu.scss': {
        locals: {
          itemMobile: 'itemMobileClass',
          item: 'itemClass',
          container: 'containerClass',
          containerMobile: 'containerMobileClass',
          soundButtonReset: 'soundButtonReset',
          soundIcon: 'soundIconClass',
          itemLine: 'itemLineClass',
          disabled: 'disabledClass'
        }
      },
      'component/Icon': {
        Icon
      },
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/Dropzone': {
        Dropzone: noopReactComponent()
      },
      'component/transition/SlideAppear': {
        SlideAppear
      },
      'service/i18n': {
        i18n: {
          t: _.identity
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

  describe('renderButton', () => {
    let result,
      component,
      children,
      disabled,
      extras,
      onClickSpy;
    const getItemClassesResult = 'getItemClassesResult';

    beforeEach(() => {
      component = instanceRender(<ChatMenu />);

      onClickSpy = jasmine.createSpy('onClick');
      children = <div id='child-element'></div>;
      disabled = true;
      extras = {
        classNames: 'extraClass',
        props: {}
      };

      spyOn(component, 'getItemClasses').and.returnValue(getItemClassesResult);
      result = component.renderButton(onClickSpy, children, disabled, extras);
    });

    it('returns a button element', () => {
      expect(TestUtils.isElementOfType(result, 'button'))
        .toEqual(true);
    });

    it('sets onClick on the returned element to the value of the onClick argument', () => {
      expect(result.props.onClick)
        .toEqual(onClickSpy);
    });

    it('renders the value passed to the children argument as children of the returned element', () => {
      expect(result.props.children)
        .toEqual(children);
    });

    it('sets the disabled prop on the returned element to the value passed to the disabled argument', () => {
      expect(result.props.disabled)
        .toEqual(disabled);
    });

    it('applies the result of getItemClasses to the className prop', () => {
      expect(component.getItemClasses)
        .toHaveBeenCalledWith(disabled, extras.classNames);

      expect(result.props.className)
        .toEqual(getItemClassesResult);
    });
  });

  describe('renderDivider', () => {
    let result;

    beforeEach(() => {
      const component = instanceRender(<ChatMenu />);

      result = component.renderDivider();
    });

    it('returns a div with the itemLine classes', () => {
      expect(TestUtils.isElementOfType(result, 'div'))
        .toEqual(true);

      expect(result.props.className)
        .toEqual('itemLineClass');
    });
  });

  describe('getItemClasses', () => {
    let result,
      disabled,
      isMobile;

    beforeEach(() => {
      const component = instanceRender(<ChatMenu isMobile={isMobile} />);

      result = component.getItemClasses(disabled);
    });

    describe('when disabled is true', () => {
      beforeAll(() => {
        disabled = true;
      });

      it('adds the disabled class', () => {
        expect(result)
          .toContain('disabledClass');
      });
    });

    describe('when disabled is false', () => {
      beforeAll(() => {
        disabled = false;
      });

      it('does not add the disabled class', () => {
        expect(result)
          .not
          .toContain('disabledClass');
      });
    });

    describe('when isMobile is true', () => {
      beforeAll(() => {
        isMobile = true;
      });

      it('adds the mobile class', () => {
        expect(result)
          .toContain('itemMobileClass');

        expect(result)
          .not
          .toContain('itemClass');
      });
    });

    describe('when isMobile is false', () => {
      beforeAll(() => {
        isMobile = false;
      });

      it('adds the desktop class', () => {
        expect(result)
          .toContain('itemClass');

        expect(result)
          .not
          .toContain('itemMobileClass');
      });
    });
  });

  describe('renderSoundButton', () => {
    let result,
      playSound,
      component,
      expectedChildren;
    const renderButtonResult = 'renderButtonResult';

    beforeEach(() => {
      component = instanceRender(<ChatMenu playSound={playSound} />);

      spyOn(component, 'renderButton').and.returnValue(renderButtonResult);
      result = component.renderSoundButton();
    });

    describe('when playSound is true', () => {
      beforeAll(() => {
        playSound = true;
      });

      it('calls renderButton with the correct arguments', () => {
        expectedChildren = [
          'embeddable_framework.chat.options.sound',
          <Icon key='icon' className='soundIconClass' type='Icon--sound-on' />
        ];

        expect(component.renderButton)
          .toHaveBeenCalledWith(component.handleSoundClick, expectedChildren, false, jasmine.any(Object));
      });
    });

    describe('when playSound is false', () => {
      beforeAll(() => {
        playSound = false;
      });

      it('calls renderButton with the correct arguments', () => {
        expectedChildren = [
          'embeddable_framework.chat.options.sound',
          <Icon key='icon' className='soundIconClass' type='Icon--sound-off' />
        ];

        expect(component.renderButton)
          .toHaveBeenCalledWith(component.handleSoundClick, expectedChildren, false, jasmine.any(Object));
      });
    });

    it('returns the result of the renderButton call', () => {
      expect(result)
        .toEqual(renderButtonResult);
    });
  });

  describe('renderEmailTranscriptButton', () => {
    let result,
      component;
    const renderButtonResult = 'renderButtonResult';
    const isChatting = false;
    const emailTranscriptOnClickSpy = jasmine.createSpy('emailTranscriptOnClick');

    beforeEach(() => {
      component = instanceRender(<ChatMenu emailTranscriptOnClick={emailTranscriptOnClickSpy} isChatting={isChatting} />);

      spyOn(component, 'renderButton').and.returnValue(renderButtonResult);
      result = component.renderEmailTranscriptButton();
    });

    it('calls renderButton with the correct arguments', () => {
      expect(component.renderButton)
        .toHaveBeenCalledWith(emailTranscriptOnClickSpy, 'embeddable_framework.chat.options.emailTranscript', !isChatting);
    });

    it('returns the result of the renderButton call', () => {
      expect(result)
        .toEqual(renderButtonResult);
    });
  });

  describe('renderContactDetailsButton', () => {
    let result,
      component,
      loginEnabled;
    const renderButtonResult = 'renderButtonResult';
    const contactDetailsOnClickSpy = jasmine.createSpy('contactDetailsOnClick');

    beforeEach(() => {
      component = instanceRender(<ChatMenu contactDetailsOnClick={contactDetailsOnClickSpy} loginEnabled={loginEnabled} />);

      spyOn(component, 'renderButton').and.returnValue(renderButtonResult);
      result = component.renderContactDetailsButton();
    });

    describe('when loginEnabled is true', () => {
      beforeAll(() => {
        loginEnabled = true;
      });

      it('calls renderButton with the correct arguments', () => {
        expect(component.renderButton)
          .toHaveBeenCalledWith(contactDetailsOnClickSpy, 'embeddable_framework.chat.options.editContactDetails');
      });

      it('returns the result of the renderButton call', () => {
        expect(result)
          .toEqual(renderButtonResult);
      });
    });

    describe('when loginEnabled is false', () => {
      beforeAll(() => {
        loginEnabled = false;
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('renderEndChatButton', () => {
    let result,
      component,
      isMobile;
    const renderButtonResult = 'renderButtonResult';
    const getItemClassesResult = 'getItemClassesResult';
    const endChatOnClickSpy = jasmine.createSpy('endChatOnClick');
    const disableEndChat = false;

    beforeEach(() => {
      component = instanceRender(<ChatMenu endChatOnClick={endChatOnClickSpy} isMobile={isMobile} disableEndChat={disableEndChat} />);

      spyOn(component, 'renderButton').and.returnValue(renderButtonResult);
      spyOn(component, 'getItemClasses').and.returnValue(getItemClassesResult);
      result = component.renderEndChatButton();
    });

    describe('when isMobile is false', () => {
      beforeAll(() => {
        isMobile = false;
      });

      it('calls renderButton with the correct arguments', () => {
        expect(component.renderButton)
          .toHaveBeenCalledWith(endChatOnClickSpy, 'embeddable_framework.chat.options.endChat', disableEndChat);
      });

      it('returns the result of the renderButton call', () => {
        expect(result)
          .toEqual(renderButtonResult);
      });
    });

    describe('when isMobile is true', () => {
      beforeAll(() => {
        isMobile = true;
      });

      it('returns a div', () => {
        expect(TestUtils.isElementOfType(result, 'div'))
          .toEqual(true);
      });

      it('returns an element with the correct styles', () => {
        expect(result.props.className)
          .toEqual(getItemClassesResult);
      });

      it('returns an element with onClick set to preventContainerClick', () => {
        expect(result.props.onClick)
          .toEqual(component.preventContainerClick);
      });
    });
  });

  describe('renderGoBackButton', () => {
    let result,
      component;
    const renderButtonResult = 'renderButtonResult';
    const onGoBackClickSpy = jasmine.createSpy('onGoBackClick');

    beforeEach(() => {
      component = instanceRender(<ChatMenu onGoBackClick={onGoBackClickSpy} />);

      spyOn(component, 'renderButton').and.returnValue(renderButtonResult);
      result = component.renderGoBackButton();
    });

    it('calls renderButton with the correct arguments', () => {
      expect(component.renderButton)
        .toHaveBeenCalledWith(onGoBackClickSpy, 'embeddable_framework.chat.options.goBack');
    });

    it('returns the result of the renderButton call', () => {
      expect(result)
        .toEqual(renderButtonResult);
    });
  });

  describe('renderSendFileButton', () => {
    let result,
      attachmentsEnabled,
      component;
    const renderButtonResult = 'renderButtonResult';

    beforeEach(() => {
      component = instanceRender(<ChatMenu attachmentsEnabled={attachmentsEnabled} />);

      spyOn(component, 'renderButton').and.returnValue(renderButtonResult);
      result = component.renderSendFileButton();
    });

    describe('when attachmentsEnabled is false', () => {
      beforeAll(() => {
        attachmentsEnabled = false;
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when attachmentsEnabled is true', () => {
      beforeAll(() => {
        attachmentsEnabled = true;
      });

      it('returns a div', () => {
        expect(TestUtils.isElementOfType(result, 'div'))
          .toEqual(true);
      });

      it('returns an element with onClick set to preventContainerClick', () => {
        expect(result.props.onClick)
          .toEqual(component.preventContainerClick);
      });
    });
  });

  describe('renderDesktop', () => {
    let result;
    const soundButton = 'soundButton';
    const emailTranscriptButton = 'emailTranscriptButton';
    const contactDetailsButton = 'contactDetailsButton';
    const endChatButton = 'endChatButton';
    const divider = 'divider';
    const expectedChildren = [
      soundButton,
      divider,
      emailTranscriptButton,
      contactDetailsButton,
      divider,
      endChatButton
    ];

    beforeEach(() => {
      const component = instanceRender(<ChatMenu />);

      spyOn(component, 'renderSoundButton').and.returnValue(soundButton);
      spyOn(component, 'renderEmailTranscriptButton').and.returnValue(emailTranscriptButton);
      spyOn(component, 'renderContactDetailsButton').and.returnValue(contactDetailsButton);
      spyOn(component, 'renderEndChatButton').and.returnValue(endChatButton);
      spyOn(component, 'renderDivider').and.returnValue(divider);

      result = component.renderDesktop();
    });

    it('returns a slideAppear component', () => {
      expect(TestUtils.isElementOfType(result, SlideAppear))
        .toEqual(true);
    });

    it('sets the styles on the returned component correctly', () => {
      expect(result.props.className)
        .toEqual('containerClass');
    });

    it('renders the menu items in the correct order as children of the returned component', () => {
      expect(result.props.children)
        .toEqual(expectedChildren);
    });
  });

  describe('renderMobile', () => {
    let result,
      buttons;
    const emailTranscriptButton = 'emailTranscriptButton';
    const contactDetailsButton = 'contactDetailsButton';
    const endChatButton = 'endChatButton';
    const goBackButton = 'goBackButton';
    const sendFileButton = 'sendFileButton';
    const expectedChildren = [
      goBackButton,
      contactDetailsButton,
      sendFileButton,
      emailTranscriptButton,
      endChatButton
    ];

    beforeEach(() => {
      const component = instanceRender(<ChatMenu show={true} />);

      spyOn(component, 'renderEmailTranscriptButton').and.returnValue(emailTranscriptButton);
      spyOn(component, 'renderContactDetailsButton').and.returnValue(contactDetailsButton);
      spyOn(component, 'renderEndChatButton').and.returnValue(endChatButton);
      spyOn(component, 'renderGoBackButton').and.returnValue(goBackButton);
      spyOn(component, 'renderSendFileButton').and.returnValue(sendFileButton);

      result = component.renderMobile();
      buttons = result.props.children[1].props.children;
    });

    it('returns a div component', () => {
      expect(TestUtils.isElementOfType(result, 'div'))
        .toEqual(true);
    });

    it('sets the mobile styles on the returned component', () => {
      expect(result.props.className)
        .toEqual('containerMobileClass');
    });

    it('renders the menu items in the correct order as children of the returned component', () => {
      expect(buttons)
        .toEqual(expectedChildren);
    });
  });

  describe('render', () => {
    let result,
      component,
      isMobile;
    const renderMobileResult = 'renderMobileResult';
    const renderDesktopResult = 'renderDesktopResult';

    beforeEach(() => {
      component = instanceRender(<ChatMenu isMobile={isMobile} />);

      spyOn(component, 'renderMobile').and.returnValue(renderMobileResult);
      spyOn(component, 'renderDesktop').and.returnValue(renderDesktopResult);

      result = component.render();
    });

    describe('when isMobile is true', () => {
      beforeAll(() => {
        isMobile = true;
      });

      it('returns the result of renderMobile', () => {
        expect(result)
          .toEqual(renderMobileResult);
      });
    });

    describe('when isMobile is false', () => {
      beforeAll(() => {
        isMobile = false;
      });

      it('returns the result of renderDesktop', () => {
        expect(result)
          .toEqual(renderDesktopResult);
      });
    });
  });
});

describe('Talk component', () => {
  let Talk,
    i18nTranslateSpy,
    libPhoneNumberVendor,
    SuccessNotification = noopReactComponent(),
    Icon = noopReactComponent(),
    ZendeskLogo = noopReactComponent(),
    Message = noopReactComponent(),
    TextField = noopReactComponent(),
    renderLabelSpy = jasmine.createSpy('renderLabel'),
    getStyledLabelTextSpy = jasmine.createSpy('getLabelText'),
    shouldRenderErrorMessageSpy = jasmine.createSpy('shouldRenderErrorMessage');
  const callbackScreen = 'widget/talk/CALLBACK_ONLY_SCREEN';
  const phoneOnlyScreen = 'widget/talk/PHONE_ONLY_SCREEN';
  const successNotificationScreen = 'widget/talk/SUCCESS_NOTIFICATION_SCREEN';
  const callbackAndPhoneScreen = 'widget/talk/CALLBACK_AND_PHONE_SCREEN';

  class MockScrollContainer extends Component {
    render() {
      return <div />;
    }
  }

  beforeEach(() => {
    mockery.enable();

    const talkPath = buildSrcPath('component/talk/Talk');

    i18nTranslateSpy = jasmine.createSpy('i18n.translate').and.callFake((key) => key);

    initMockRegistry({
      'React': React,
      '@zendeskgarden/react-buttons': { Button: noopReactComponent },
      'component/form/Form': { Form: noopReactComponent },
      'component/talk/TalkPhoneField': { TalkPhoneField: noopReactComponent },
      'component/Icon': { Icon },
      'component/container/ScrollContainer': { ScrollContainer: MockScrollContainer },
      'component/ZendeskLogo': { ZendeskLogo },
      'component/shared/SuccessNotification': { SuccessNotification },
      'service/i18n': { i18n: { t: i18nTranslateSpy, isRTL: _.noop } },
      'src/constants/shared': {
        ICONS: {
          SUCCESS_TALK: 'icon'
        }
      },
      'src/redux/modules/talk': {
        updateTalkScreen: noop,
        updateTalkCallbackForm: noop
      },
      'src/redux/modules/talk/talk-screen-types': {
        CALLBACK_ONLY_SCREEN: callbackScreen,
        PHONE_ONLY_SCREEN: phoneOnlyScreen,
        SUCCESS_NOTIFICATION_SCREEN: successNotificationScreen
      },
      'src/redux/modules/talk/talk-selectors': {},
      './Talk.scss': {
        locals: {
          content: 'contentClasses',
          contentMobile: 'contentMobileClasses',
          scrollContainerSuccess: 'scrollContainerSuccessClass',
          noZendeskLogoButton: 'noZendeskLogoButton',
          zendeskLogoButton: 'zendeskLogoButton'
        }
      },
      '@zendeskgarden/react-textfields': {
        TextField,
        Label: noopReactComponent(),
        Input: noopReactComponent(),
        Textarea: noopReactComponent(),
        Message
      },
      'src/util/fields': {
        renderLabel: renderLabelSpy,
        shouldRenderErrorMessage: shouldRenderErrorMessageSpy,
        getStyledLabelText: getStyledLabelTextSpy
      }
    });

    mockery.registerAllowable(talkPath);
    Talk = requireUncached(talkPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('renderNameField', () => {
    let result,
      componentArgs,
      mockRenderErrorMessage;

    beforeEach(() => {
      const component = instanceRender(<Talk {...componentArgs} />);

      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage);
      result = component.renderNameField();
    });

    describe('when called', () => {
      beforeAll(() => {
        componentArgs = {
          formFields: {
            name: { required: true }
          }
        };
      });

      it('renders a type of TextField', () => {
        expect(TestUtils.isElementOfType(result, TextField))
          .toEqual(true);
      });

      it('has props.name of name', () => {
        expect(result.props.children[1].props.name)
          .toEqual('name');
      });

      it('has props.required of false', () => {
        expect(result.props.children[1].props.required)
          .toEqual(false);
      });
    });

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message;
      });

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toEqual('error');
      });
    });

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null;
      });

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toEqual('none');
      });
    });
  });

  describe('renderDescriptionField', () => {
    let result,
      componentArgs,
      mockRenderErrorMessage;

    beforeEach(() => {
      const component = instanceRender(<Talk {...componentArgs} />);

      spyOn(component, 'renderErrorMessage').and.callFake(() => mockRenderErrorMessage);
      result = component.renderNameField();
    });

    describe('when called', () => {
      beforeAll(() => {
        componentArgs = {
          formFields: {
            name: { required: true }
          }
        };
      });

      it('renders a type of TextField', () => {
        expect(TestUtils.isElementOfType(result, TextField))
          .toEqual(true);
      });

      it('has props.name of name', () => {
        expect(result.props.children[1].props.name)
          .toEqual('name');
      });

      it('has props.required of false', () => {
        expect(result.props.children[1].props.required)
          .toEqual(false);
      });
    });

    describe('when invalid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = Message;
      });

      it('renders field in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toEqual('error');
      });
    });

    describe('when valid', () => {
      beforeAll(() => {
        mockRenderErrorMessage = null;
      });

      it('renders field not in an error state', () => {
        expect(result.props.children[1].props.validation)
          .toEqual('none');
      });
    });
  });

  describe('renderErrorMessage', () => {
    let result,
      mockErrorString;

    beforeEach(() => {
      let component = instanceRender(<Talk />);

      result = component.renderErrorMessage('val', true, mockErrorString, 'aaa');
    });

    describe('when we should render error message', () => {
      beforeAll(() => {
        mockErrorString = 'yolo';
        shouldRenderErrorMessageSpy.and.returnValue(true);
      });

      it('returns a Message component', () => {
        expect(TestUtils.isElementOfType(result, Message))
          .toEqual(true);
      });

      it('renders error string', () => {
        expect(result.props.children)
          .toEqual('yolo');
      });
    });

    describe('when we should not render error message', () => {
      beforeAll(() => {
        shouldRenderErrorMessageSpy.and.returnValue(false);
      });

      it('returns no Message component', () => {
        expect(result)
          .toBeFalsy();
      });
    });
  });

  describe('handleFormCompleted', () => {
    let talk,
      form,
      config,
      submitTalkCallbackFormSpy,
      mockFormValid;

    beforeEach(() => {
      submitTalkCallbackFormSpy = jasmine.createSpy('submitTalkCallbackForm');
      config = { serviceUrl: 'https://talk_service.com', nickname: 'Support' };
      talk = instanceRender(
        <Talk
          talkConfig={config}
          submitTalkCallbackForm={submitTalkCallbackFormSpy} />
      );
      spyOn(talk, 'setState');
      form = { clear: jasmine.createSpy('form.clear') };

      talk.form = form;
      talk.form.state = {
        valid: mockFormValid
      };
      talk.handleFormCompleted({
        phone: '+61423456789',
        name: 'John',
        email: 'john@john.com',
        description: 'I need help in understanding your products.'
      });
    });

    describe('when form is valid', () => {
      beforeAll(() => {
        mockFormValid = true;
      });

      it('calls submitTalkCallbackForm with the form state', () => {
        expect(submitTalkCallbackFormSpy)
          .toHaveBeenCalledWith({
            phone: '+61423456789',
            name: 'John',
            email: 'john@john.com',
            description: 'I need help in understanding your products.'
          }, 'https://talk_service.com', 'Support');
      });

      it('sets showErrors to false', () => {
        expect(talk.setState)
          .toHaveBeenCalledWith({ showErrors: false });
      });
    });

    describe('when form is invalid', () => {
      beforeAll(() => {
        mockFormValid = false;
      });

      it('does not call submitTalkCallbackForm', () => {
        expect(submitTalkCallbackFormSpy)
          .not
          .toHaveBeenCalled();
      });

      it('sets showErrors to true', () => {
        expect(talk.setState)
          .toHaveBeenCalledWith({ showErrors: true });
      });
    });
  });

  describe('handleFormChange', () => {
    let talk, updateTalkCallbackFormSpy;

    beforeEach(() => {
      updateTalkCallbackFormSpy = jasmine.createSpy('updateTalkCallbackForm');
      talk = instanceRender(<Talk updateTalkCallbackForm={updateTalkCallbackFormSpy} />);
      talk.handleFormChange({ phone: '+61423456789', name: 'Sally' });
    });

    it('calls updateTalkCallbackForm with the newly changed form state', () => {
      expect(updateTalkCallbackFormSpy)
        .toHaveBeenCalledWith({ phone: '+61423456789', name: 'Sally' });
    });
  });

  describe('formatPhoneNumber', () => {
    let libPhoneNumberFormatSpy,
      libPhoneNumberParseSpy;

    beforeEach(() => {
      libPhoneNumberFormatSpy = jasmine.createSpy('libphonenumber.format').and.callFake((phoneObj) => phoneObj.phone);
      libPhoneNumberParseSpy = jasmine.createSpy('libphonenumber.parse').and.callFake((phone) => {
        return { country: 'AU', phone };
      });

      const libPhoneNumberVendor = { format: libPhoneNumberFormatSpy, parse: libPhoneNumberParseSpy };
      const config = { phoneNumber: '+61361275109' };
      const talk = instanceRender(<Talk embeddableConfig={config} libphonenumber={libPhoneNumberVendor} />);

      talk.formatPhoneNumber(config.phoneNumber);
    });

    it('calls libphonenumber.parse with correct params', () => {
      expect(libPhoneNumberParseSpy)
        .toHaveBeenCalledWith('+61361275109');
    });

    it('calls libphonenumber.format with correct params', () => {
      expect(libPhoneNumberFormatSpy)
        .toHaveBeenCalledWith({ country: 'AU', phone: '+61361275109' }, 'International');
    });
  });

  describe('renderAverageWaitTime', () => {
    let talk,
      result,
      mockAverageWaitTime;

    describe('when the average wait time is enabled', () => {
      describe('when the average wait time is greater than 1', () => {
        beforeEach(() => {
          mockAverageWaitTime = '5';
          talk = domRender(
            <Talk
              averageWaitTime={mockAverageWaitTime}
              averageWaitTimeEnabled={true} />
          );
          result = talk.renderAverageWaitTime();
        });

        it('calls i18n.t with the average wait time', () => {
          expect(i18nTranslateSpy.calls.mostRecent().args[1].averageWaitTime)
            .toBe(mockAverageWaitTime);
        });

        it('renders the plural average wait time message', () => {
          expect(result.props.children)
            .toBe('embeddable_framework.talk.form.averageWaitTimePlural');
        });
      });

      describe('when the average wait time is not greater than 1', () => {
        beforeEach(() => {
          mockAverageWaitTime = '1';
          talk = domRender(
            <Talk
              averageWaitTime={mockAverageWaitTime}
              averageWaitTimeEnabled={true} />
          );
          result = talk.renderAverageWaitTime();
        });

        it('calls i18n.t with the average wait time', () => {
          expect(i18nTranslateSpy.calls.mostRecent().args[1].averageWaitTime)
            .toBe(mockAverageWaitTime);
        });

        it('renders the singular average wait time message', () => {
          expect(result.props.children)
            .toBe('embeddable_framework.talk.form.averageWaitTimeSingular');
        });
      });
    });

    describe('when the average wait time is not enabled', () => {
      beforeEach(() => {
        talk = domRender(<Talk averageWaitTimeEnabled={false} />);
        result = talk.renderAverageWaitTime();
      });

      it('returns undefined', () => {
        expect(result)
          .toBeUndefined();
      });
    });
  });

  describe('renderFooterContent', () => {
    let talk,
      result,
      mockScreen,
      mockHideZendeskLogo,
      mockIsMobile;

    beforeEach(() => {
      talk = instanceRender(
        <Talk
          screen={mockScreen}
          isMobile={mockIsMobile}
          hideZendeskLogo={mockHideZendeskLogo} />
      );
      result = talk.renderFooterContent();
    });

    describe('when screen is not SUCCESS_NOTIFICATION_SCREEN', () => {
      beforeAll(() => {
        mockScreen = 'yoloScreen';
      });

      it('does not render footer content', () => {
        expect(result)
          .toBeFalsy();
      });
    });

    describe('when footer content required', () => {
      beforeAll(() => {
        mockScreen = successNotificationScreen;
      });

      describe('when on mobile', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('renders noZendeskLogoButton class', () => {
          expect(result.props.className)
            .toContain('noZendeskLogoButton');
        });

        it('does not render zendeskLogoButton class', () => {
          expect(result.props.className)
            .not
            .toContain('zendeskLogoButton');
        });
      });

      describe('when hideZendeskLogo is true', () => {
        beforeAll(() => {
          mockHideZendeskLogo = true;
        });

        it('renders noZendeskLogoButton', () => {
          expect(result.props.className)
            .toContain('noZendeskLogoButton');
        });

        it('does not renders zendeskLogoButton', () => {
          expect(result.props.className)
            .not
            .toContain('zendeskLogoButton');
        });
      });

      describe('when zendesk logo required', () => {
        beforeAll(() => {
          mockHideZendeskLogo = false;
          mockIsMobile = false;
        });

        it('renders zendeskLogoButton', () => {
          expect(result.props.className)
            .toContain('zendeskLogoButton');
        });

        it('does not render noZendeskLogoButton', () => {
          expect(result.props.className)
            .not
            .toContain('noZendeskLogoButton');
        });
      });
    });
  });

  describe('renderZendeskLogo', () => {
    let talk,
      result,
      mockHideZendeskLogo,
      mockIsMobile;

    beforeEach(() => {
      talk = domRender(
        <Talk
          hideZendeskLogo={mockHideZendeskLogo}
          isMobile={mockIsMobile} />
      );
      result = talk.renderZendeskLogo();
    });

    describe('when hideZendeskLogo is true', () => {
      beforeAll(() => {
        mockHideZendeskLogo = true;
      });

      describe('when isMobile is true', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('does not render zendesk logo', () => {
          expect(result)
            .toBeFalsy();
        });
      });

      describe('when isMobile is false', () => {
        beforeAll(() => {
          mockIsMobile = false;
        });

        it('does not render zendesk logo', () => {
          expect(result)
            .toBeFalsy();
        });
      });
    });

    describe('when hideZendeskLogo is false', () => {
      beforeAll(() => {
        mockHideZendeskLogo = false;
      });

      describe('when isMobile is true', () => {
        beforeAll(() => {
          mockIsMobile = true;
        });

        it('does not render zendesk logo', () => {
          expect(result)
            .toBeFalsy();
        });
      });

      describe('when isMobile is false', () => {
        beforeAll(() => {
          mockIsMobile = false;
        });

        it('renders zendesk logo', () => {
          expect(TestUtils.isElementOfType(result, ZendeskLogo))
            .toEqual(true);
        });
      });
    });
  });

  describe('render', () => {
    let talk,
      scrollContainer,
      result;

    describe('when screen is success notification', () => {
      beforeEach(() => {
        talk = instanceRender(<Talk screen={successNotificationScreen} />);
        result = talk.render();
      });

      it('renders scrollContainerSuccess style', () => {
        const scrollContainer = result.props.children[0];

        expect(scrollContainer.props.containerClasses)
          .toContain('scrollContainerSuccessClass');
      });
    });

    describe('when screen is not success notification', () => {
      beforeEach(() => {
        talk = instanceRender(<Talk screen={'bob'} />);
        result = talk.render();
      });

      it('does not render scrollContainerSuccess style', () => {
        const scrollContainer = result.props.children[0];

        expect(scrollContainer.props.containerClasses)
          .not.toContain('scrollContainerSuccessClass');
      });
    });

    describe('when not on mobile', () => {
      beforeEach(() => {
        talk = domRender(<Talk />);
        spyOn(talk, 'renderFooterContent');
        result = talk.renderFooterContent();
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('applies the content styles to the scroll container children container', () => {
        expect(scrollContainer.props.children.props.className)
          .toBe('contentClasses');
      });

      it('calls renderFooterContent', () => {
        expect(talk.renderFooterContent)
          .toHaveBeenCalled();
      });
    });

    describe('when on mobile', () => {
      beforeEach(() => {
        talk = domRender(<Talk isMobile={true} />);
        spyOn(talk, 'renderFooterContent');
        result = talk.renderFooterContent();
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('applies the contentMobile styles to the scroll container children container', () => {
        expect(scrollContainer.props.children.props.className)
          .toBe('contentMobileClasses');
      });

      it('calls renderFooterContent', () => {
        expect(talk.renderFooterContent)
          .toHaveBeenCalled();
      });
    });

    describe('when on the success notification screen', () => {
      beforeEach(() => {
        talk = domRender(<Talk screen={successNotificationScreen} />);
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('shows the success notification scroll container header title', () => {
        expect(scrollContainer.props.title)
          .toBe('embeddable_framework.talk.notify.success.title');
      });
    });

    describe('when on the call me back form screen', () => {
      beforeEach(() => {
        talk = domRender(
          <Talk
            formTitleKey='formTitle'
            formState={{ phone: '' }}
            screen={callbackScreen} />
        );
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('shows the form scroll container header title', () => {
        expect(scrollContainer.props.title)
          .toBe('embeddable_framework.talk.form.title');
      });
    });
  });

  describe('renderFormTitle', () => {
    let result;

    describe('when the screen is SUCCESS_NOTIFICATION_SCREEN', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen={successNotificationScreen} />);

        result = talk.renderFormTitle();
      });

      it('returns the successNotificationTitle string', () => {
        expect(result)
          .toEqual('embeddable_framework.talk.notify.success.title');
      });
    });

    describe('when the screen is CALLBACK_ONLY_SCREEN', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen={callbackScreen} />);

        result = talk.renderFormTitle();
      });

      it('returns the formTitle string', () => {
        expect(result)
          .toEqual('embeddable_framework.talk.form.title');
      });
    });

    describe('when the screen is PHONE_ONLY_SCREEN', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen={phoneOnlyScreen} />);

        result = talk.renderFormTitle();
      });

      it('returns the phoneOnly screen title string', () => {
        expect(result)
          .toEqual('embeddable_framework.talk.phoneOnly.title');
      });
    });

    describe('when the screen is CALLBACK_AND_PHONE_SCREEN', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen={callbackAndPhoneScreen} />);

        result = talk.renderFormTitle();
      });

      it('returns the formTitle string', () => {
        expect(result)
          .toEqual('embeddable_framework.talk.form.title');
      });
    });

    describe('when the screen is unrecognised', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen='foo' />);

        result = talk.renderFormTitle();
      });

      it('returns the formTitle string', () => {
        expect(result)
          .toEqual('embeddable_framework.talk.form.title');
      });
    });
  });

  describe('renderPhoneFormScreen', () => {
    let config,
      formatPhoneNumberSpy;

    beforeEach(() => {
      config = { phoneNumber: '+61434032660' };
      formatPhoneNumberSpy = jasmine.createSpy('formatPhoneNumber');

      const talk = instanceRender(<Talk embeddableConfig={config} />);

      talk.formatPhoneNumber = formatPhoneNumberSpy;
      talk.renderPhoneFormScreen();
    });

    it('formats the phone number', () => {
      expect(formatPhoneNumberSpy)
        .toHaveBeenCalledWith(config.phoneNumber);
    });
  });

  describe('renderPhoneOnlyScreen', () => {
    let config,
      formatPhoneNumberSpy,
      result;

    beforeEach(() => {
      config = { phoneNumber: '+61434032660' };
      formatPhoneNumberSpy = jasmine.createSpy('formatPhoneNumber');

      const talk = instanceRender(<Talk embeddableConfig={config} />);

      talk.formatPhoneNumber = formatPhoneNumberSpy;
      result = talk.renderPhoneOnlyScreen();
    });

    it('formats the phone number', () => {
      expect(formatPhoneNumberSpy)
        .toHaveBeenCalledWith(config.phoneNumber);
    });

    it('renders new message string', () => {
      expect(result.props.children[1].props.children)
        .toEqual('embeddable_framework.talk.phoneOnly.new_message');
    });

    it('renders talk icon', () => {
      expect(TestUtils.isElementOfType(result.props.children[0], Icon))
        .toEqual(true);
    });
  });

  describe('renderSuccessNotificationScreen', () => {
    let result,
      talk;

    beforeEach(() => {
      talk = instanceRender(<Talk />);
      result = talk.renderSuccessNotificationScreen();
    });

    it('renders SuccessNotification component', () => {
      expect(TestUtils.isElementOfType(result, SuccessNotification))
        .toEqual(true);
    });
  });

  describe('renderFormScreen', () => {
    let talk;

    beforeEach(() => {
      talk = instanceRender(<Talk screen={callbackScreen} />);

      spyOn(talk, 'renderPhoneField');
      spyOn(talk, 'renderNameField');
      spyOn(talk, 'renderDescriptionField');
      talk.renderFormScreen();
    });

    it('renders all fields', () => {
      expect(talk.renderPhoneField)
        .toHaveBeenCalled();
      expect(talk.renderNameField)
        .toHaveBeenCalled();
      expect(talk.renderDescriptionField)
        .toHaveBeenCalled();
    });
  });

  describe('renderContent', () => {
    let result,
      renderFormScreenSpy,
      renderPhoneOnlyScreenSpy,
      renderSuccessNotificationScreenSpy,
      renderPhoneFormScreenSpy;

    describe('when the screen is CALLBACK_ONLY_SCREEN', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen={callbackScreen} />);

        renderFormScreenSpy = jasmine.createSpy();
        talk.renderFormScreen = renderFormScreenSpy;

        result = talk.renderContent();
      });

      it('calls renderFormScreen', () => {
        expect(renderFormScreenSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen is PHONE_ONLY_SCREEN', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen={phoneOnlyScreen} />);

        renderPhoneOnlyScreenSpy = jasmine.createSpy();
        talk.renderPhoneOnlyScreen = renderPhoneOnlyScreenSpy;

        result = talk.renderContent();
      });

      it('calls renderPhoneOnlyScreen', () => {
        expect(renderPhoneOnlyScreenSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen is SUCCESS_NOTIFICATION_SCREEN', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen={successNotificationScreen} />);

        renderSuccessNotificationScreenSpy = jasmine.createSpy();
        talk.renderSuccessNotificationScreen = renderSuccessNotificationScreenSpy;

        result = talk.renderContent();
      });

      it('calls renderSuccessNotificationScreen', () => {
        expect(renderSuccessNotificationScreenSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen is CALLBACK_AND_PHONE_SCREEN', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen={callbackAndPhoneScreen} />);

        renderPhoneFormScreenSpy = jasmine.createSpy();
        talk.renderPhoneFormScreen = renderPhoneFormScreenSpy;

        result = talk.renderContent();
      });

      it('calls renderSuccessNotificationScreen', () => {
        expect(renderSuccessNotificationScreenSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen is unrecognised', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk screen='undefinedScreen' />);

        result = talk.renderContent();
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });

    describe('when no agents are available', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk agentAvailability={false} />);

        result = talk.renderContent();
      });

      it('returns null', () => {
        expect(result)
          .toBeNull();
      });
    });
  });

  describe('renderOfflineScreen', () => {
    let talk;

    describe('when agents are available', () => {
      beforeEach(() => {
        talk = instanceRender(<Talk agentAvailability={true} />);
      });

      it('returns null', () => {
        expect(talk.renderOfflineScreen())
          .toBeNull();
      });
    });

    describe('when agents are not available', () => {
      let link;

      describe('when help center is available', () => {
        beforeEach(() => {
          talk = domRender(
            <Talk
              agentAvailability={false}
              helpCenterAvailable={true}
              libphonenumber={libPhoneNumberVendor} />
          );
          link = talk.renderOfflineScreen().props.children[1];
        });

        it('has the correct link text', () => {
          expect(link.props.children)
            .toBe('embeddable_framework.talk.offline.link.help_center');
        });
      });

      describe('when channel choice is available', () => {
        beforeEach(() => {
          talk = domRender(
            <Talk
              agentAvailability={false}
              channelChoiceAvailable={true}
              libphonenumber={libPhoneNumberVendor} />
          );
          link = talk.renderOfflineScreen().props.children[1];
        });

        it('has the correct link text', () => {
          expect(link.props.children)
            .toBe('embeddable_framework.common.button.goBack');
        });
      });

      describe('when help center and channel choice are not available', () => {
        beforeEach(() => {
          talk = domRender(<Talk agentAvailability={false} />);
          link = talk.renderOfflineScreen().props.children[1];
        });

        it('has empty link text', () => {
          expect(link.props.children)
            .toBe('');
        });
      });
    });
  });

  describe('renderErrorNotification', () => {
    let result;

    describe('when the user has queued a callback', () => {
      beforeEach(() => {
        const mockCallback = { error: { message: 'phone_number_already_in_queue' } };
        const talk = instanceRender(<Talk callback={mockCallback} />);

        result = talk.renderErrorNotification();
      });

      it('renders a message describing the subject ', () => {
        expect(result.props.children)
          .toContain('embeddable_framework.talk.notify.error.phone_number_already_in_queue');
      });
    });

    describe('when a generic error has occurred upon form submission', () => {
      beforeEach(() => {
        const mockCallback = { error: { message: 'fooBar' } };
        const talk = instanceRender(<Talk callback={mockCallback} />);

        result = talk.renderErrorNotification();
      });

      it('renders a message describing the subject ', () => {
        expect(result.props.children)
          .toContain('embeddable_framework.common.notify.error.generic');
      });
    });
  });

  describe('renderPhoneNumber', () => {
    let result;
    const mockEmbeddableConfig = {
      phoneNumber: '+61405474139'
    };

    beforeEach(() => {
      const talk = instanceRender(<Talk embeddableConfig={mockEmbeddableConfig} />);

      result = talk.renderPhoneNumber();
    });

    it('renders an anchor link', () => {
      expect(result.type)
        .toEqual('a');
    });

    it('has a href value of "tel:+61405474139"', () => {
      const expected = `tel:${mockEmbeddableConfig.phoneNumber}`;

      expect(result.props.href)
        .toContain(expected);
    });
  });
});

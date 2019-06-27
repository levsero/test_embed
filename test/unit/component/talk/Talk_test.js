describe('Talk component', () => {
  let Talk,
    i18nTranslateSpy,
    SuccessNotification = noopReactComponent(),
    Icon = noopReactComponent(),
    ZendeskLogo = noopReactComponent(),
    Message = noopReactComponent(),
    TextField = noopReactComponent(),
    renderLabelSpy = jasmine.createSpy('renderLabel'),
    getStyledLabelTextSpy = jasmine.createSpy('getLabelText'),
    shouldRenderErrorMessageSpy = jasmine.createSpy('shouldRenderErrorMessage'),
    mockServiceUrl = 'https://talk_service.com',
    mockNickname = 'Support',
    mockTitle = 'Some call title';
  const callbackScreen = 'widget/talk/CALLBACK_ONLY_SCREEN';
  const phoneOnlyScreen = 'widget/talk/PHONE_ONLY_SCREEN';
  const successNotificationScreen = 'widget/talk/SUCCESS_NOTIFICATION_SCREEN';

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
      './ErrorNotification': noopReactComponent,
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
      },
      'src/redux/modules/selectors': {
        getTalkTitle: () => mockTitle,
        getTalkNickname: () => mockNickname,
        getTalkServiceUrl: () => mockServiceUrl
      }
    });

    mockery.registerAllowable(talkPath);
    Talk = requireUncached(talkPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleFormCompleted', () => {
    let talk,
      form,
      submitTalkCallbackFormSpy,
      mockFormValid;

    beforeEach(() => {
      submitTalkCallbackFormSpy = jasmine.createSpy('submitTalkCallbackForm');
      talk = instanceRender(
        <Talk
          nickname={mockNickname}
          serviceUrl={mockServiceUrl}
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
          .toHaveBeenCalledWith('https://talk_service.com', 'Support');
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
});

describe('Talk component', () => {
  let Talk,
    i18nTranslateSpy,
    libPhoneNumberFormatSpy,
    libPhoneNumberParseSpy;
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
    resetDOM();

    mockery.enable();

    const talkPath = buildSrcPath('component/talk/Talk');

    libPhoneNumberFormatSpy = jasmine.createSpy('libphonenumber.format');
    libPhoneNumberParseSpy = jasmine.createSpy('libphonenumber.parse').and.callFake((phone) => {
      return { country: 'AU', phone };
    });
    i18nTranslateSpy = jasmine.createSpy('i18n.translate').and.callFake((key) => key);

    initMockRegistry({
      'React': React,
      'libphonenumber-js': { format: libPhoneNumberFormatSpy, parse: libPhoneNumberParseSpy },
      'component/form/Form': { Form: noopReactComponent },
      'component/field/Field': { Field: noopReactComponent },
      'component/field/EmailField': { EmailField: noopReactComponent },
      'component/talk/TalkPhoneField': { TalkPhoneField: noopReactComponent },
      'component/Icon': { Icon: noopReactComponent },
      'component/container/ScrollContainer': { ScrollContainer: MockScrollContainer },
      'component/ZendeskLogo': { ZendeskLogo: noopReactComponent },
      'service/i18n': { i18n: { t: i18nTranslateSpy, isRTL: _.noop } },
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
      './Talk.sass': {
        locals: {
          footer: 'footerClasses'
        }
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
      config,
      submitTalkCallbackFormSpy;

    beforeEach(() => {
      submitTalkCallbackFormSpy = jasmine.createSpy('submitTalkCallbackForm');
      config = { serviceUrl: 'https://talk_service.com', keyword: 'Support' };
      talk = instanceRender(
        <Talk
          talkConfig={config}
          zendeskSubdomain='z3npparker'
          submitTalkCallbackForm={submitTalkCallbackFormSpy} />
      );
      form = { clear: jasmine.createSpy('form.clear') };

      talk.form = form;
      talk.handleFormCompleted({
        phone: '+61423456789',
        name: 'John',
        email: 'john@john.com',
        description: 'I need help in understanding your products.'
      });
    });

    it('calls submitTalkCallbackForm with the form state', () => {
      expect(submitTalkCallbackFormSpy)
        .toHaveBeenCalledWith({
          phone: '+61423456789',
          name: 'John',
          email: 'john@john.com',
          description: 'I need help in understanding your products.'
        }, 'z3npparker', 'https://talk_service.com', 'Support');
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
    beforeEach(() => {
      const config = { phoneNumber: '+61361275109' };
      const talk = instanceRender(<Talk embeddableConfig={config} />);

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

    describe('when the average wait time is greater than 1', () => {
      beforeEach(() => {
        mockAverageWaitTime = '5';
        talk = domRender(<Talk averageWaitTime={mockAverageWaitTime} />);
        result = talk.renderAverageWaitTime();
      });

      it('calls i18n.t with the average wait time', () => {
        expect(i18nTranslateSpy.calls.mostRecent().args[1].averageWaitTime)
          .toBe(mockAverageWaitTime);
      });

      it('renders the plural averge wait time message', () => {
        expect(result.props.children)
          .toBe('embeddable_framework.talk.form.averageWaitTimePlural');
      });
    });

    describe('when the average wait time is not greater than 1', () => {
      beforeEach(() => {
        mockAverageWaitTime = '1';
        talk = domRender(<Talk averageWaitTime={mockAverageWaitTime} />);
        result = talk.renderAverageWaitTime();
      });

      it('calls i18n.t with the average wait time', () => {
        expect(i18nTranslateSpy.calls.mostRecent().args[1].averageWaitTime)
          .toBe(mockAverageWaitTime);
      });

      it('renders the singular averge wait time message', () => {
        expect(result.props.children)
          .toBe('embeddable_framework.talk.form.averageWaitTimeSingular');
      });
    });
  });

  describe('render', () => {
    let talk, scrollContainer;

    describe('when on the success notification screen', () => {
      beforeEach(() => {
        talk = domRender(<Talk screen={successNotificationScreen} />);
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('shows the success notification scroll container header title', () => {
        expect(scrollContainer.props.title)
          .toBe('embeddable_framework.talk.notify.success.title');
      });

      it('does not apply the footer styles to the scroll container', () => {
        expect(scrollContainer.props.footerClasses)
          .toBe('');
      });
    });

    describe('when on the call me back form screen', () => {
      beforeEach(() => {
        talk = domRender(<Talk formTitleKey='formTitle' formState={{ phone: '' }} screen={callbackScreen} />);
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('shows the form scroll container header title', () => {
        expect(scrollContainer.props.title)
          .toBe('embeddable_framework.talk.form.title');
      });

      it('applies the footer styles to the scroll container', () => {
        expect(scrollContainer.props.footerClasses)
          .toBe('footerClasses');
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
      formatPhoneNumberSpy;

    beforeEach(() => {
      config = { phoneNumber: '+61434032660' };
      formatPhoneNumberSpy = jasmine.createSpy('formatPhoneNumber');

      const talk = instanceRender(<Talk embeddableConfig={config} />);

      talk.formatPhoneNumber = formatPhoneNumberSpy;
      talk.renderPhoneOnlyScreen();
    });

    it('formats the phone number', () => {
      expect(formatPhoneNumberSpy)
        .toHaveBeenCalledWith(config.phoneNumber);
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
  });
});

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
    mockery.enable();

    const talkPath = buildSrcPath('component/talk/Talk');

    libPhoneNumberFormatSpy = jasmine.createSpy('libphonenumber.format').and.callFake((phoneObj) => phoneObj.phone);
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
      './Talk.scss': {
        locals: {
          footer: 'footerClasses',
          content: 'contentClasses',
          contentMobile: 'contentMobileClasses'
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
      config = { serviceUrl: 'https://talk_service.com', nickname: 'Support' };
      talk = instanceRender(
        <Talk
          talkConfig={config}
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
        }, 'https://talk_service.com', 'Support');
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

    describe('when the average wait time is enabled', () => {
      describe('when the average wait time is greater than 1', () => {
        beforeEach(() => {
          mockAverageWaitTime = '5';
          talk = domRender(<Talk averageWaitTime={mockAverageWaitTime} averageWaitTimeEnabled={true}/>);
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
          talk = domRender(<Talk averageWaitTime={mockAverageWaitTime} averageWaitTimeEnabled={true} />);
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

  describe('render', () => {
    let talk, scrollContainer;

    describe('when not on mobile', () => {
      beforeEach(() => {
        talk = domRender(<Talk />);
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('applies the content styles to the scroll container children container', () => {
        expect(scrollContainer.props.children.props.className)
          .toBe('contentClasses');
      });
    });

    describe('when on mobile', () => {
      beforeEach(() => {
        talk = domRender(<Talk isMobile={true} />);
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('applies the contentMobile styles to the scroll container children container', () => {
        expect(scrollContainer.props.children.props.className)
          .toBe('contentMobileClasses');
      });
    });

    describe('when not on the success notification screen', () => {
      describe('when not on mobile', () => {
        beforeEach(() => {
          talk = domRender(<Talk />);
          scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
        });

        it('applies the footer styles to the scroll container', () => {
          expect(scrollContainer.props.footerClasses)
            .toBe('footerClasses');
        });
      });

      describe('when on mobile', () => {
        beforeEach(() => {
          talk = domRender(<Talk isMobile={true} />);
          scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
        });

        it('does not apply the footer styles to the scroll container', () => {
          expect(scrollContainer.props.footerClasses)
            .toBe('');
        });
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
        talk = domRender(<Talk formTitleKey='formTitle' formState={{ phone: '' }} screen={callbackScreen} />);
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
          talk = domRender(<Talk agentAvailability={false} helpCenterAvailable={true} />);
          link = talk.renderOfflineScreen().props.children[1];
        });

        it('has the correct link text', () => {
          expect(link.props.children.props.children)
            .toBe('embeddable_framework.talk.offline.link.help_center');
        });
      });

      describe('when channel choice is available', () => {
        beforeEach(() => {
          talk = domRender(<Talk agentAvailability={false} channelChoiceAvailable={true} />);
          link = talk.renderOfflineScreen().props.children[1];
        });

        it('has the correct link text', () => {
          expect(link.props.children.props.children)
            .toBe('embeddable_framework.common.button.goBack');
        });
      });

      describe('when help center and channel choice are not available', () => {
        beforeEach(() => {
          talk = domRender(<Talk agentAvailability={false} />);
          link = talk.renderOfflineScreen().props.children[1];
        });

        it('has empty link text', () => {
          expect(link.props.children.props.children)
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

    describe('when accessed from a mobile device', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk isMobile={true} embeddableConfig={mockEmbeddableConfig} />);

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

    describe('when accessed from a desktop environment', () => {
      beforeEach(() => {
        const talk = instanceRender(<Talk isMobile={false} embeddableConfig={mockEmbeddableConfig} />);

        result = talk.renderPhoneNumber();
      });

      it('renders a span', () => {
        expect(result.type)
          .toEqual('span');
      });

      it('renders with a number inside the span', () => {
        expect(result.props.children)
          .toEqual(mockEmbeddableConfig.phoneNumber);
      });
    });
  });
});

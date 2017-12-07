describe('Talk component', () => {
  let Talk;
  const callbackScreen = 'widget/talk/CALLBACK_ONLY_SCREEN';
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

    initMockRegistry({
      'React': React,
      'component/form/Form': { Form: noopReactComponent },
      'component/field/Field': { Field: noopReactComponent },
      'component/field/EmailField': { EmailField: noopReactComponent },
      'component/talk/TalkPhoneField': { TalkPhoneField: noopReactComponent },
      'component/Icon': { Icon: noopReactComponent },
      'component/container/ScrollContainer': { ScrollContainer: MockScrollContainer },
      'component/ZendeskLogo': { ZendeskLogo: noopReactComponent },
      'service/i18n': { i18n: { t: (key) => key, isRTL: _.noop } },
      'src/redux/modules/talk': {
        updateTalkScreen: noop,
        updateTalkCallbackForm: noop
      },
      'src/redux/modules/talk/talk-screen-types': {
        CALLBACK_ONLY_SCREEN: callbackScreen,
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

  describe('renderContent', () => {
    let result,
      renderFormScreenSpy,
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

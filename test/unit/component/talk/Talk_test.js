describe('Talk component', () => {
  let Talk,
    httpSpy;
  const callMeScreen = 'widget/talk/CALL_ME_SCREEN';
  const successNotificationScreen = 'widget/talk/SUCCESS_NOTIFICATION_SCREEN';

  class MockScrollContainer extends Component {
    render() {
      return <div />;
    }
  }

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    const talkPath = buildSrcPath('component/talk/Talk');

    httpSpy = jasmine.createSpyObj('http', ['callMeRequest']);

    initMockRegistry({
      'React': React,
      'component/form/Form': { Form: noopReactComponent },
      'utility/common_fields': {
        renderEmailField: () => noopReactComponent,
        renderTextField: () => noopReactComponent,
        renderPhoneField: () => noopReactComponent,
        renderTextAreaField: () => noopReactComponent
      },
      'component/Icon': { Icon: noopReactComponent },
      'component/container/ScrollContainer': { ScrollContainer: MockScrollContainer },
      'component/ZendeskLogo': { ZendeskLogo: noopReactComponent },
      'service/i18n': { i18n: { t: (key) => key, isRTL: _.noop } },
      'service/transport': { http: httpSpy },
      'src/redux/modules/talk': {
        updateTalkScreen: noop,
        updateTalkCallMeForm: noop,
        updateTalkPhoneNumber: noop
      },
      'src/redux/modules/talk/talk-screen-types': {
        CALL_ME_SCREEN: callMeScreen,
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
      updateTalkScreenSpy,
      updateTalkPhoneNumberSpy;

    beforeEach(() => {
      updateTalkScreenSpy = jasmine.createSpy('updateTalkScreen');
      updateTalkPhoneNumberSpy = jasmine.createSpy('updateTalkPhoneNumber');
      config = { serviceUrl: 'https://talk_service.com', keyword: 'Support' };
      talk = instanceRender(
        <Talk
          talkConfig={config}
          zendeskSubdomain='z3npparker'
          updateTalkScreen={updateTalkScreenSpy}
          updateTalkPhoneNumber={updateTalkPhoneNumberSpy} />
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

    it('calls http.callMeRequest', () => {
      const expectedPayload = {
        params: {
          phoneNumber: '+61423456789',
          additional_info: { // eslint-disable-line camelcase
            name: 'John',
            email: 'john@john.com',
            description: 'I need help in understanding your products.'
          },
          subdomain: 'z3npparker',
          keyword: 'Support'
        },
        callbacks: { done: jasmine.any(Function) }
      };

      expect(httpSpy.callMeRequest)
        .toHaveBeenCalledWith(config.serviceUrl, expectedPayload);
    });

    describe('when the request is successful', () => {
      let doneCallback;

      beforeEach(() => {
        doneCallback = httpSpy.callMeRequest.calls.mostRecent().args[1].callbacks.done;
        doneCallback({ body: { phone_number: '+61423456789' } }); // eslint-disable-line camelcase
      });

      it('clears the form', () => {
        expect(form.clear)
          .toHaveBeenCalled();
      });

      it('calls updateTalkScreen with the SUCCESS_NOTIFICATION_SCREEN', () => {
        expect(updateTalkScreenSpy)
          .toHaveBeenCalledWith(successNotificationScreen);
      });

      it('calls updateTalkPhoneNumber with the phone number', () => {
        expect(updateTalkPhoneNumberSpy)
          .toHaveBeenCalledWith('+61423456789');
      });
    });
  });

  describe('handleFormChange', () => {
    let talk, updateTalkCallMeFormSpy;

    beforeEach(() => {
      updateTalkCallMeFormSpy = jasmine.createSpy('updateTalkCallMeForm');
      talk = instanceRender(<Talk updateTalkCallMeForm={updateTalkCallMeFormSpy} />);
      talk.handleFormChange({ phone: '+61423456789', name: 'Sally' });
    });

    it('calls updateTalkCallMeForm with the newly changed form state', () => {
      expect(updateTalkCallMeFormSpy)
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
        talk = domRender(<Talk formTitleKey='formTitle' formState={{ phone: '' }} screen={callMeScreen} />);
        scrollContainer = TestUtils.findRenderedComponentWithType(talk, MockScrollContainer);
      });

      it('shows the form scroll container header title', () => {
        expect(scrollContainer.props.title)
          .toBe('embeddable_framework.talk.form.title.formTitle');
      });

      it('applies the footer styles to the scroll container', () => {
        expect(scrollContainer.props.footerClasses)
          .toBe('footerClasses');
      });
    });
  });
});

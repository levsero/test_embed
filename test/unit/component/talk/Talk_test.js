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
      'component/field/Field': { Field: noopReactComponent },
      'component/Icon': { Icon: noopReactComponent },
      'component/container/ScrollContainer': { ScrollContainer: MockScrollContainer },
      'component/ZendeskLogo': { ZendeskLogo: noopReactComponent },
      'service/i18n': { i18n: { t: (key) => key, isRTL: _.noop } },
      'service/transport': { http: httpSpy },
      'src/redux/modules/talk/talk-screen-types': {
        CALL_ME_SCREEN: callMeScreen,
        SUCCESS_NOTIFICATION_SCREEN: successNotificationScreen
      },
      './Talk.sass': {
        locals: {
          footer: 'footerClasses'
        }
      }
    });

    mockery.registerAllowable(talkPath);
    Talk = requireUncached(talkPath).Talk;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('clearNotification', () => {
    let talk;

    beforeEach(() => {
      talk = instanceRender(<Talk />);
      talk.clearNotification();
    });

    it('sets current screen to CALL_ME_SCREEN', () => {
      expect(talk.state.currentScreen)
        .toBe(callMeScreen);
    });
  });

  describe('handleFormCompleted', () => {
    let talk,
      form,
      config;

    beforeEach(() => {
      config = { serviceUrl: 'https://talk_service.com', keyword: 'Support' };
      talk = instanceRender(<Talk talkConfig={config} zendeskSubdomain='z3npparker' />);
      form = { clear: jasmine.createSpy('form.clear') };

      talk.form = form;
      talk.handleFormCompleted({ phone: '+61423456789' });
    });

    it('calls http.callMeRequest', () => {
      const expectedPayload = {
        params: {
          phoneNumber: '+61423456789',
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

      it('sets screen to SUCCESS_NOTIFICATION_SCREEN', () => {
        expect(talk.state.currentScreen)
          .toBe(successNotificationScreen);
      });

      it('sets the phoneNumber to the number receieved in response', () => {
        expect(talk.state.phoneNumber)
          .toBe('+61423456789');
      });
    });
  });

  describe('handleFormChange', () => {
    let talk;

    beforeEach(() => {
      talk = instanceRender(<Talk />);
      talk.handleFormChange({ phone: '+61423456789' });
    });

    it('sets the form state', () => {
      expect(talk.state.formState)
        .toEqual({ phone: '+61423456789' });
    });
  });

  describe('render', () => {
    let talk, scrollContainer;

    beforeEach(() => {
      talk = domRender(<Talk formTitleKey='formTitle' />);
    });

    describe('when on the success notification screen', () => {
      beforeEach(() => {
        talk.setState({ currentScreen: successNotificationScreen });
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

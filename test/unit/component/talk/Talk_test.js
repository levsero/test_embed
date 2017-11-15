fdescribe('Talk component', () => {
  let Talk,
    httpSpy;
  const talkPath = buildSrcPath('component/talk/Talk');

  class MockScrollContainer extends React.Component {
    render() {
      return <div />;
    }
  }

  beforeEach(() => {
    resetDOM();

    mockery.enable();

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

    it('sets showSuccessNotification to false', () => {
      expect(talk.state.showSuccessNotification)
        .toBe(false);
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

    describe('when the request is successfull', () => {
      let doneCallback;

      beforeEach(() => {
        doneCallback = httpSpy.callMeRequest.calls.mostRecent().args[1].callbacks.done;
        // eslint-disable-next-line camelcase
        doneCallback({ body: { phone_number: '+61423456789' } });
      });

      it('clears the form', () => {
        expect(form.clear)
          .toHaveBeenCalled();
      });

      it('sets showSuccessNotification to true', () => {
        expect(talk.state.showSuccessNotification)
          .toBe(true);
      });

      it('sets the successNotificationMessage to correct string', () => {
        expect(talk.state.successNotificationMessage)
          .toBe('embeddable_framework.talk.notify.success.message');
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

    describe('when the success notification is showing', () => {
      beforeEach(() => {
        talk.setState({ showSuccessNotification: true });
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

    describe('when the success notification is not showing', () => {
      beforeEach(() => {
        talk.setState({ showSuccessNotification: false });
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

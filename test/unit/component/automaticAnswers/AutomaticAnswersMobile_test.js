describe('AutomaticAnswersMobile component', () => {
  let AutomaticAnswersMobile,
    AutomaticAnswers,
    Button,
    component;

  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswers');
  const automaticAnswersMobilePath = buildSrcPath('component/automaticAnswers/AutomaticAnswersMobile');
  const buttonPath = buildSrcPath('component/button/Button');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    Button = requireUncached(buttonPath).Button;

    initMockRegistry({
      'React': React,
      'component/container/Container': {
        Container: class extends Component {
          render() {
            // use of () => here breaks the domRender test due to outer 'this' context
            // use of function() here preserves 'this' context
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return <div className='Icon' />;
          }
        }
      },
      'component/button/Button': {
        Button: Button
      },
      'utility/pages': {
        getHelpCenterArticleId: jasmine.createSpy().and.callFake(() => '456')
      },
      'service/automaticAnswersPersistence' : {
        automaticAnswersPersistence: {
          getContext: jasmine.createSpy().and.callFake(() => '123')
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    AutomaticAnswers = requireUncached(automaticAnswersPath).AutomaticAnswers;
    initMockRegistry({
      'component/automaticAnswers/AutomaticAnswers': {
        AutomaticAnswers: AutomaticAnswers
      }
    });

    AutomaticAnswersMobile = requireUncached(automaticAnswersMobilePath).AutomaticAnswersMobile;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleSolveClick', () => {
    beforeEach(() => {
      component = shallow(
         <AutomaticAnswersMobile
           solveTicket={jasmine.createSpy()} />);
      spyOn(component.instance(), 'handleSolveTicket');
      component.find('.c-btn').simulate('click');
    });

    it('calls handleSolveTicket', () => {
      expect(component.instance().handleSolveTicket)
        .toHaveBeenCalled();
    });
  });

  describe('renderContent', () => {
    describe('when the ticket is not solved', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersMobile />
        );
        spyOn(component, 'renderTicketContent');
        component.renderContent();
      });

      it('renders the solve ticket content', () => {
        expect(component.renderTicketContent)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen state is set to TICKET_CLOSED', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersMobile
            closeFrame={() => {}} />
        );
        spyOn(component, 'renderSuccessContent');
        component.setState({ screen: AutomaticAnswers.ticketClosed });
      });

      it('renders a success message', () => {
        expect(component.renderSuccessContent)
          .toHaveBeenCalled();
      });
    });
  });

  describe('renderButton', () => {
    describe('when the ticket is not submitting', () => {
      beforeEach(() => {
        component = shallow(<AutomaticAnswersMobile />);
        component.setState({ 'isSubmitting' : false });
      });

      it('renders a button with a call to action string', () => {
        expect(component.find('.c-btn--primary--icon').text().includes('embeddable_framework.automaticAnswers.button_mobile'))
          .toEqual(true);
      });
    });

    describe('when the ticket is submitting', () => {
      beforeEach(() => {
        component = shallow(<AutomaticAnswersMobile />);
        component.setState({ 'isSubmitting' : true });
      });

      it('renders a button with a "..." string', () => {
        expect(component.find('.c-btn--primary--icon').text().includes('...'))
          .toEqual(true);
      });
    });
  });

  describe('renderErrorMessage', () => {
    describe('when errorMessage is falsely', () => {
      beforeEach(() => {
        component = shallow(<AutomaticAnswersMobile />);
        component.setState({ 'errorMessage' : '' });
      });

      it('contains .u-isHidden', () => {
        expect(component.find('.u-isError.u-isHidden').length)
          .toEqual(1);
      });
    });

    describe('when errorMessage is truthy', () => {
      beforeEach(() => {
        component = shallow(<AutomaticAnswersMobile />);
        component.setState({ 'errorMessage' : 'dude things are wrong.' });
      });

      it('does not contain .u-isHidden', () => {
        expect(component.find('.u-isError.u-isHidden').length)
          .toEqual(0);
      });
    });
  });
});

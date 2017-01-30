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
      component.find('.AutomaticAnswersBtn--cta').simulate('click');
    });

    it('calls handleSolveTicket', () => {
      expect(component.instance().handleSolveTicket)
        .toHaveBeenCalled();
    });
  });

  describe('renderContent', () => {
    beforeEach(() => {
      component = shallow(<AutomaticAnswersMobile closeFrame={() => {}}/>);
    });

    describe('when the screen state is set to SOLVE_TICKET_QUESTION', () => {
      beforeEach(() => {
        spyOn(component.instance(), 'renderTicketContent');
        component.setState({ screen: requireUncached(automaticAnswersPath).SOLVE_TICKET_QUESTION });
      });

      it('renders the solve question content', () => {
        expect(component.instance().renderTicketContent)
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

      it('renders the success content', () => {
        expect(component.instance().renderSuccessContent)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen state is set to MARK_AS_IRRELEVANT', () => {
      beforeEach(() => {
        spyOn(component.instance(), 'renderIrrelevantContent');
        component.setState({ screen: requireUncached(automaticAnswersPath).MARK_AS_IRRELEVANT });
      });

      it('renders the mark as irrelevant content', () => {
        expect(component.instance().renderIrrelevantContent)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen state is set to THANKS_FOR_FEEDBACK', () => {
      beforeEach(() => {
        spyOn(component.instance(), 'renderThanksForFeedbackContent');
        component.setState({ screen: requireUncached(automaticAnswersPath).THANKS_FOR_FEEDBACK });
      });

      it('renders the mark as irrelevant content', () => {
        expect(component.instance().renderThanksForFeedbackContent)
          .toHaveBeenCalled();
      });
    });

    describe('default behaviour for the screen state', () => {
      beforeEach(() => {
        spyOn(component.instance(), 'renderSolveQuestion');
        component.setState({ screen: 'thing' });
      });

      it('renders the solve question content', () => {
        expect(component.instance().renderSolveQuestion)
          .toHaveBeenCalled();
      });
    });
  });

  describe('renderButtons', () => {
    describe('when the close ticket request is not submitting', () => {
      beforeEach(() => {
        component = shallow(<AutomaticAnswersMobile />);
        component.setState({ 'isSubmitting' : false });
      });

      it('renders a button with a call to action string', () => {
        expect(component.find('.AutomaticAnswersBtn--cta').props().label)
          .toEqual('embeddable_framework.automaticAnswers.desktop.solve.yes');
      });

      it('renders a button labelled No', () => {
        expect(component.find('.AutomaticAnswersBtn--no').props().label)
          .toEqual('embeddable_framework.automaticAnswers.desktop.solve.no');
      });
    });

    describe('when the close ticket request is submitting', () => {
      beforeEach(() => {
        component = shallow(<AutomaticAnswersMobile />);
        component.setState({ 'isSubmitting' : true });
      });

      it('disables the cta button and the no button', () => {
        const buttons = component.find(Button);

        expect(buttons.length)
          .toEqual(2);

        expect(buttons.everyWhere(n => n.prop('disabled')))
          .toEqual(true);
      });
    });
  });

  describe('renderIrrelevantContent', () => {
    describe('when the irrelevant feedback request is submitting', () => {
      beforeEach(() => {
        component = shallow(<AutomaticAnswersMobile />);
        component.setState({ 'isSubmitting' : true });
      });

      it('disables both buttons', () => {
        expect(component.find('Button').everyWhere(n => n.props('disabled')))
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

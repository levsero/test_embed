describe('AutomaticAnswersMobile component', () => {
  let AutomaticAnswersMobile,
    automaticAnswersProps,
    component;

  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswersMobile');

  beforeEach(() => {
    automaticAnswersProps = {
      handleSolveTicket: jasmine.createSpy()
    };

    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Container': {
        Container: React.createClass({
          render: function() {
            // use of () => here breaks the domRender test due to outer 'this' context
            // use of function() here preserves 'this' context
            return <div>{this.props.children}</div>;
          }
        })
      },
      'component/Icon': {
        Icon: React.createClass({
          render: () => <div className='Icon' />
        })
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    AutomaticAnswersMobile = requireUncached(automaticAnswersPath).AutomaticAnswersMobile;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleSolveClick', () => {
    const e = { preventDefault: jasmine.createSpy() };

    beforeEach(() => {
      component = instanceRender(
        <AutomaticAnswersMobile
          {...automaticAnswersProps} />
      );
      component.handleSolveClick(e);
    });

    it('prevents the default DOM click event', () => {
      expect(e.preventDefault)
        .toHaveBeenCalled();
    });

    it('calls handleSolveTicket', () => {
      expect(component.props.handleSolveTicket)
        .toHaveBeenCalled();
    });
  });

  describe('renderContent', () => {
    describe('when the ticket is not solved', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersMobile
            solveSuccess={false} />
        );
        spyOn(component, 'renderTicketContent');
        component.renderContent();
      });

      it('renders the solve ticket content', () => {
        expect(component.renderTicketContent)
          .toHaveBeenCalled();
      });
    });

    describe('when the ticket is solved', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersMobile
            solveSuccess={true} />
        );
        spyOn(component, 'renderSuccessContent');
        component.renderContent();
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
        domRender(
          <AutomaticAnswersMobile
            isSubmitting={false} />
        );
      });

      it('renders a button with a call to action string', () => {
        expect(document.querySelector('.c-btn--primary--icon span').innerHTML)
          .toEqual('embeddable_framework.automaticAnswers.button_mobile');
      });
    });

    describe('when the ticket is submitting', () => {
      beforeEach(() => {
        domRender(
          <AutomaticAnswersMobile
            isSubmitting={true} />
        );
      });

      it('renders a button with a "..." string', () => {
        expect(document.querySelector('.c-btn--primary--icon span').innerHTML)
          .toEqual('...');
      });
    });
  });

  describe('renderErrorMessage', () => {
    describe('when errorMessage is falsely', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersMobile
            errorMessage={''} />
        );
      });

      it('contains .u-isHidden', () => {
        expect(component.renderErrorMessage().props.className)
          .toContain('u-isHidden');
      });
    });

    describe('when errorMessage is truthy', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersMobile
            errorMessage={'derp'} />
        );
      });

      it('does not contain .u-isHidden', () => {
        expect(component.renderErrorMessage().props.className)
          .not.toContain('u-isHidden');
      });
    });
  });
});

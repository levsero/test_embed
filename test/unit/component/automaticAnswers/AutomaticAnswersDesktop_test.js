describe('AutomaticAnswersDesktop component', () => {
  let AutomaticAnswersDesktop,
    automaticAnswersProps,
    component;

  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswersDesktop');

  beforeEach(() => {
    automaticAnswersProps = {
      handleSolveTicket: jasmine.createSpy(),
      ticketNiceId: 8765
    };

    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Container': {
        Container: class {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/button/Button': {
        Button: NoopReactComponent()
      },
      'component/Icon': {
        Icon: class {
          render() {
            return <div className='Avatar' />;
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    AutomaticAnswersDesktop = requireUncached(automaticAnswersPath).AutomaticAnswersDesktop;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleSolveClick', () => {
    const e = { preventDefault: jasmine.createSpy() };

    beforeEach(() => {
      component = instanceRender(
        <AutomaticAnswersDesktop
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

  describe('renderMasterIcon', () => {
    describe('when the ticket is not solved', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersDesktop
            solveSuccess={false} />
        );
      });

      it('renders an article icon', () => {
        expect(component.renderMasterIcon().props.type)
          .toEqual('Icon--article');
      });
    });

    describe('when the ticket is solved', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersDesktop
            solveSuccess={true} />
        );
      });

      it('renders a tick icon', () => {
        expect(component.renderMasterIcon().props.type)
          .toEqual('Icon--tick');
      });
    });
  });

  describe('renderContent', () => {
    describe('when the ticket is not solved', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersDesktop
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
          <AutomaticAnswersDesktop
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
        component = instanceRender(
          <AutomaticAnswersDesktop
            isSubmitting={false} />
        );
      });

      it('renders a button with a call to action string', () => {
        expect(component.renderButton().props.children.props.label)
          .toEqual('embeddable_framework.automaticAnswers.button.solve_v2');
      });
    });

    describe('when the ticket is submitting', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersDesktop
            isSubmitting={true} />
        );
      });

      it('renders a button with a submitting string', () => {
        expect(component.renderButton().props.children.props.label)
          .toEqual('embeddable_framework.submitTicket.form.submitButton.label.sending');
      });
    });
  });

  describe('renderErrorMessage', () => {
    describe('when errorMessage is falsely', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersDesktop
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
          <AutomaticAnswersDesktop
            errorMessage={'derp'} />
        );
      });

      it('does not contain .u-isHidden', () => {
        expect(component.renderErrorMessage().props.className)
          .not.toContain('u-isHidden');
      });
    });
  });

  describe('renderIntroduction', () => {
    describe('when errorMessage is falsely', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersDesktop
          errorMessage={''} />
        );
      });

      it('contains .u-borderBottom', () => {
        expect(component.renderIntroduction().props.className)
          .toContain('u-borderBottom');
      });
    });

    describe('when errorMessage is truthy', () => {
      beforeEach(() => {
        component = instanceRender(
          <AutomaticAnswersDesktop
            errorMessage={'derp'} />
        );
      });

      it('does not contain .u-borderBottom', () => {
        expect(component.renderIntroduction().props.className)
          .not.toContain('u-borderBottom');
      });
    });
  });
});

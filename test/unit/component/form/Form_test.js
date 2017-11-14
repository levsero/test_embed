describe('Form component', () => {
  let Form;
  const formPath = buildSrcPath('component/form/Form');

  class MockButton extends React.Component {
    render() {
      return <div />;
    }
  }

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/button/Button': { Button: MockButton },
      'component/button/ButtonGroup': {
        ButtonGroup: class extends React.Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      }
    });

    mockery.registerAllowable(formPath);
    Form = requireUncached(formPath).Form;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleFormSubmit', () => {
    let form, onFormCompletedSpy, preventDefaultSpy;

    beforeEach(() => {
      onFormCompletedSpy = jasmine.createSpy('onFormCompleted');
      preventDefaultSpy = jasmine.createSpy('preventDefault');
      form = instanceRender(<Form onFormCompleted={onFormCompletedSpy} />);

      form.setState({ formState: { email: 'omega@zd.com' } });
      form.handleFormSubmit({ preventDefault: preventDefaultSpy });
    });

    it('calls event.preventDefault', () => {
      expect(preventDefaultSpy)
        .toHaveBeenCalled();
    });

    it('calls props.onFormCompleted with the form state', () => {
      expect(onFormCompletedSpy)
        .toHaveBeenCalledWith({ email: 'omega@zd.com' });
    });
  });

  describe('handleFormChange', () => {
    let form,
      onFormChangeSpy,
      mockFormValidity,
      formElement;
    const target = { name: 'email', value: 'theta@zd.com' };

    beforeEach(() => {
      onFormChangeSpy = jasmine.createSpy('onFormCompleted');
      form = instanceRender(<Form onFormChange={onFormChangeSpy} />);
      formElement = { checkValidity: () => mockFormValidity };

      form.form = formElement;
      form.handleFormChange({ target });
    });

    describe('when the form is valid', () => {
      beforeEach(() => {
        mockFormValidity = true;
        form.form = formElement;
        form.handleFormChange({ target });
      });

      it('sets the valid state to true', () => {
        expect(form.state.valid)
          .toBe(true);
      });
    });

    describe('when the form is invalid', () => {
      beforeEach(() => {
        mockFormValidity = false;
        form.form = formElement;
        form.handleFormChange({ target });
      });

      it('sets the valid state to false', () => {
        expect(form.state.valid)
          .toBe(false);
      });
    });

    it('sets the form state', () => {
      expect(form.state.formState)
        .toEqual({ email: 'theta@zd.com' });
    });

    it('calls props.onFormChange with the form state', () => {
      expect(onFormChangeSpy)
        .toHaveBeenCalledWith({ email: 'theta@zd.com' });
    });
  });

  describe('render', () => {
    let form;

    describe('submit button', () => {
      let button;

      beforeEach(() => {
        form = domRender(<Form submitButtonLabel='label' />);
        button = TestUtils.findRenderedComponentWithType(form, MockButton);
      });

      it('sets the label to props.submitButtonLabel', () => {
        expect(button.props.label)
          .toBe('label');
      });

      it('sets the type to submit', () => {
        expect(button.props.type)
          .toBe('submit');
      });

      describe('when the form is valid', () => {
        beforeEach(() => {
          form.setState({ valid: true });
          button = TestUtils.findRenderedComponentWithType(form, MockButton);
        });

        it('sets disabled to false', () => {
          expect(button.props.disabled)
            .toBe(false);
        });
      });

      describe('when the form is invalid', () => {
        beforeEach(() => {
          form.setState({ valid: false });
          button = TestUtils.findRenderedComponentWithType(form, MockButton);
        });

        it('sets disabled to true', () => {
          expect(button.props.disabled)
            .toBe(true);
        });
      });
    });
  });
});

describe('Form component', () => {
  let Form;
  const formPath = buildSrcPath('component/form/Form');

  class MockButton extends Component {
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
        ButtonGroup: class extends Component {
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

  describe('clear', () => {
    let form;

    beforeEach(() => {
      form = instanceRender(<Form />);
      form.setState({ formState: { email: 'bigO@zd.com' }, valid: true });

      form.clear();
    });

    it('clears the formState', () => {
      expect(form.state.formState)
        .toEqual({});
    });

    it('sets the form to invalid', () => {
      expect(form.state.valid)
        .toBe(false);
    });
  });

  describe('handleFormSubmit', () => {
    let form, onCompletedSpy, preventDefaultSpy;

    beforeEach(() => {
      onCompletedSpy = jasmine.createSpy('onCompleted');
      preventDefaultSpy = jasmine.createSpy('preventDefault');
      form = instanceRender(<Form onCompleted={onCompletedSpy} />);

      form.setState({ formState: { email: 'omega@zd.com' } });
      form.handleFormSubmit({ preventDefault: preventDefaultSpy });
    });

    it('calls event.preventDefault', () => {
      expect(preventDefaultSpy)
        .toHaveBeenCalled();
    });

    it('calls props.onCompleted with the form state', () => {
      expect(onCompletedSpy)
        .toHaveBeenCalledWith({ email: 'omega@zd.com' });
    });
  });

  describe('handleFormChange', () => {
    let form,
      onChangeSpy,
      mockFormValidity,
      formElement;
    const target = { name: 'email', value: 'theta@zd.com' };

    beforeEach(() => {
      onChangeSpy = jasmine.createSpy('onCompleted');
      form = instanceRender(<Form onChange={onChangeSpy} />);
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

    it('calls props.onChange with the form state', () => {
      expect(onChangeSpy)
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

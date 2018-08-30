describe('Form component', () => {
  let Form;
  const formPath = buildSrcPath('component/form/Form');

  class MockButton extends Component {
    render() {
      return <div />;
    }
  }

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      '@zendeskgarden/react-buttons': { Button: MockButton },
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

  describe('isFormValid', () => {
    let form,
      result,
      mockFormState,
      mockCheckValidity,
      mockCustomValid;

    beforeEach(() => {
      form = instanceRender(<Form formState={mockFormState} />);
      form.form = {
        checkValidity: () => mockCheckValidity
      };
      result = form.isFormValid(mockCustomValid);
    });

    describe('form checkValidity', () => {
      beforeAll(() => {
        mockCustomValid = true;
        mockFormState = {
          email: 'yolo'
        };
      });

      describe('when overall form is valid', () => {
        beforeAll(() => {
          mockCheckValidity = true;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when overall form is not valid', () => {
        beforeAll(() => {
          mockCheckValidity = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('form state', () => {
      beforeAll(() => {
        mockCustomValid = true;
        mockCheckValidity = true;
      });

      describe('when there is form state', () => {
        beforeAll(() => {
          mockFormState = {
            email: 'yolO@yolo.com'
          };
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when there is no form state', () => {
        beforeAll(() => {
          mockFormState = {};
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });
  });

  describe('handleFormSubmit', () => {
    let form, onCompletedSpy, preventDefaultSpy;

    beforeEach(() => {
      onCompletedSpy = jasmine.createSpy('onCompleted');
      preventDefaultSpy = jasmine.createSpy('preventDefault');
      form = instanceRender(<Form formState={{ email: 'omega@zd.com' }} onCompleted={onCompletedSpy} />);

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
      onChangeSpy = jasmine.createSpy('onChange');
      form = instanceRender(<Form formState={{email: 'a@a.com'}} onChange={onChangeSpy} />);
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

    it('calls props.onChange with the form state', () => {
      expect(onChangeSpy)
        .toHaveBeenCalledWith({ email: 'theta@zd.com' });
    });
  });

  describe('render', () => {
    let form;

    describe('submit button', () => {
      let button;

      describe('button props', () => {
        beforeEach(() => {
          form = shallowRender(<Form formState={{ email: 'a@a.com' }} submitButtonLabel='label' />);
          button = form.props.children[1].props.children;
        });

        it('sets the chilren to props.submitButtonLabel', () => {
          expect(button.props.children)
            .toBe('label');
        });

        it('sets the type to submit', () => {
          expect(button.props.type)
            .toBe('submit');
        });
      });
    });
  });
});

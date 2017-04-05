describe('Checkbox component', () => {
  let Checkbox;
  const checkboxPath = buildSrcPath('component/field/Checkbox');

  beforeEach(() => {
    resetDOM();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      './Checkbox.sass': {
        locals: {
          'checkbox': 'checkboxClasses',
          'checkmarkUnchecked': 'checkmarkUncheckedClasses',
          'description': 'descriptionClasses',
          'focused': 'focusClasses',
          'invalid': 'invalidClasses',
          'label': 'labelClasses'
        }
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return (
              <span>
                <svg />
              </span>
            );
          }
        }
      }
    });

    mockery.registerAllowable(checkboxPath);

    Checkbox = requireUncached(checkboxPath).Checkbox;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    describe('checkbox', () => {
      let checkbox, checkboxNode, checkmark;

      beforeEach(() => {
        checkbox = domRender(<Checkbox />);
        checkboxNode = ReactDOM.findDOMNode(checkbox);
        checkmark = checkbox.renderCheckbox().props.children[0].props.children;
      });

      describe('check icon', () => {
        it('should be hidden when unchecked', () => {
          expect(checkmark.props.className)
            .toContain('checkmarkUncheckedClasses');
        });

        it('should be shown when checked', () => {
          checkbox.setState({ value: 1 });
          checkmark = checkbox.renderCheckbox().props.children[0].props.children;

          expect(checkmark.props.className)
            .not.toContain('checkmarkUncheckedClasses');
        });
      });

      it('should not have focused or invalid classes by default', () => {
        expect(checkboxNode.querySelector('.focusClasses'))
          .toBeNull();

        expect(checkboxNode.querySelector('.invalidClasses'))
          .toBeNull();
      });

      describe('when focused', () => {
        it('should display the focused classes', () => {
          checkbox.setState({ focused: true });

          expect(checkboxNode.querySelector('.focusClasses'))
            .toBeTruthy();
        });
      });

      describe('when invalid', () => {
        it('should display the invalid classes', () => {
          checkbox.setState({ hasError: true, blurred: true });

          expect(checkboxNode.querySelector('.invalidClasses'))
            .toBeTruthy();
        });
      });

      describe('label', () => {
        it('should not have a * by default', () => {
          checkbox = domRender(<Checkbox />);
          checkboxNode = ReactDOM.findDOMNode(checkbox);

          expect(checkboxNode.querySelector('.labelClasses').innerHTML)
            .not.toContain('*');
        });

        it('should have a * if it is required', () => {
          checkbox = domRender(<Checkbox required={true} />);
          checkboxNode = ReactDOM.findDOMNode(checkbox);

          expect(checkboxNode.querySelector('.labelClasses').innerHTML)
            .toContain('*');
        });
      });

      describe('description', () => {
        it('should be added if the prop is present', () => {
          checkbox = domRender(<Checkbox description='hello' />);
          checkboxNode = ReactDOM.findDOMNode(checkbox);

          expect(checkboxNode.querySelector('.descriptionClasses').innerHTML)
            .toEqual('hello');
        });

        it('should not be added if the prop is missing', () => {
          checkbox = domRender(<Checkbox />);
          checkboxNode = ReactDOM.findDOMNode(checkbox);

          expect(checkboxNode.querySelector('.descriptionClasses').innerHTML)
            .toEqual('');
        });
      });
    });
  });

  describe('onChange', () => {
    let checkbox;

    beforeEach(() => {
      checkbox = domRender(<Checkbox />);

      checkbox.input.validity = { valid: null };

      checkbox.onChange();
    });

    it('should change the value', () => {
      expect(checkbox.state.value)
        .toEqual(1);

      checkbox.onChange();

      expect(checkbox.state.value)
        .toEqual(0);
    });

    describe('when input is valid', () => {
      beforeEach(() => {
        checkbox.input.validity = { valid: true };
        checkbox.onChange();
      });

      it('should set the error state to false', () => {
        expect(checkbox.state.hasError)
          .toEqual(false);
      });
    });

    describe('when input is invalid', () => {
      beforeEach(() => {
        checkbox.input.validity = { valid: false };
        checkbox.onChange();
      });

      it('should set the error state to true', () => {
        expect(checkbox.state.hasError)
          .toEqual(true);
      });
    });
  });

  describe('onBlur', () => {
    let checkbox;

    beforeEach(() => {
      checkbox = domRender(<Checkbox />);

      // jsdom doesn't support html5 validation api
      checkbox.input.validity = { valid: null };

      checkbox.onBlur();
    });

    describe('when input is valid', () => {
      beforeEach(() => {
        checkbox.input.validity = { valid: true };
        checkbox.onBlur();
      });

      it('should set the error state to false', () => {
        expect(checkbox.state.hasError)
          .toEqual(false);
      });
    });

    describe('when input is invalid', () => {
      beforeEach(() => {
        checkbox.input.validity = { valid: false };
        checkbox.onBlur();
      });

      it('should set the error state to true', () => {
        expect(checkbox.state.hasError)
          .toEqual(true);
      });
    });
  });
});

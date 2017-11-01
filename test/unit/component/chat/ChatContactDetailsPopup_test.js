describe('ChatContactDetailsPopup component', () => {
  let ChatContactDetailsPopup,
    mockForm,
    mockFormValidity;
  const ChatContactDetailsPopupPath = buildSrcPath('component/chat/ChatContactDetailsPopup');

  class ChatPopup extends Component {
    render() {
      const { className, rightCtaDisabled } = this.props;

      return <div className={className} rightCtaDisabled={rightCtaDisabled} /> ;
    }
  }

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    mockFormValidity = false;

    initMockRegistry({
      'component/chat/ChatContactDetailsPopup.sass': {
        locals: {}
      },
      'component/chat/ChatPopup': { ChatPopup },
      'component/field/Field': {
        Field: class extends Component {
          render() {
            return this.props.input
                 ? React.cloneElement(this.props.input, _.extend({}, this.props))
                 : <input
                    name={this.props.name}
                    required={this.props.required}
                    pattern={this.props.pattern}
                    type={this.props.type} />;
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      }
    });

    mockForm = {
      checkValidity: () => mockFormValidity,
      elements: [
        {
          name: 'name',
          value: 'John Snow'
        },
        {
          name: 'email',
          value: 'j@l.r'
        }
      ]
    };

    mockery.registerAllowable(ChatContactDetailsPopupPath);
    ChatContactDetailsPopup = requireUncached(ChatContactDetailsPopupPath).ChatContactDetailsPopup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleSave', () => {
    let component,
      rightCtaFnSpy;

    beforeEach(() => {
      rightCtaFnSpy = jasmine.createSpy('rightCtaFn');
      component = instanceRender(<ChatContactDetailsPopup rightCtaFn={rightCtaFnSpy} />);

      component.setState({ formState: { name: 'bob', email: 'bob@zd.com' } });
      component.handleSave();
    });

    it('calls props.rightCtaFn with form state name and email', () => {
      expect(rightCtaFnSpy)
        .toHaveBeenCalledWith('bob', 'bob@zd.com');
    });
  });

  describe('handleFormChange', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<ChatContactDetailsPopup />);
      mockFormValidity = true;
      component.form = mockForm;

      component.handleFormChange({ target: { name: 'name', value: 'bob' } });
    });

    it('sets state.valid', () => {
      expect(component.state.valid)
        .toBe(true);
    });

    it('sets state.formState', () => {
      expect(component.state.formState)
        .toEqual({ name: 'bob' });
    });
  });

  describe('render', () => {
    let component,
      popupComponent;

    describe('when the form is valid', () => {
      beforeEach(() => {
        component = domRender(<ChatContactDetailsPopup />);
        component.setState({ valid: true });

        popupComponent = TestUtils.findRenderedComponentWithType(component, ChatPopup);
      });

      it('renders ChatPopup with rightCtaDisabled prop as false', () => {
        expect(popupComponent.props.rightCtaDisabled)
          .toBe(false);
      });
    });

    describe('when the form is invalid', () => {
      beforeEach(() => {
        component = domRender(<ChatContactDetailsPopup />);
        component.setState({ valid: false });

        popupComponent = TestUtils.findRenderedComponentWithType(component, ChatPopup);
      });

      it('renders ChatPopup with rightCtaDisabled prop as true', () => {
        expect(popupComponent.props.rightCtaDisabled)
          .toBe(true);
      });
    });
  });
});

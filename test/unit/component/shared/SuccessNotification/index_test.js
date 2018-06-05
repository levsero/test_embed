describe('SuccessNotification component', () => {
  let SuccessNotification;
  const successNotificationPath = buildSrcPath('component/shared/SuccessNotification');

  class MockIcon extends React.Component {
    render() {
      return (
        <div className='Avatar' />
      );
    }
  }

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      './SuccessNotification.scss': {
        locals: {
          'button': 'btnClass'
        }
      },
      'component/Icon': {
        Icon: MockIcon
      },
      'component/button/Button': {
        Button: class extends Component {
          render() {
            const { onClick, className } = this.props;

            return (
              <input type='button' className={className} onClick={onClick} />
            );
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    mockery.registerAllowable(successNotificationPath);
    SuccessNotification = requireUncached(successNotificationPath).SuccessNotification;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('onDoneClick', () => {
    let componentNode, onDoneSpy;

    beforeEach(() => {
      onDoneSpy = jasmine.createSpy();
      const component = domRender(
        <SuccessNotification onDoneClick={onDoneSpy} />
      );

      componentNode = ReactDOM.findDOMNode(component);
    });

    it('calls onDoneClick prop on button click', () => {
      componentNode.querySelector('.btnClass').click();

      expect(onDoneSpy)
        .toHaveBeenCalled();
    });
  });

  describe('icon', () => {
    let component;

    beforeEach(() => {
      component = domRender(
        <SuccessNotification icon='my-icon' />
      );
    });

    it('renders the icon', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, MockIcon))
        .not.toThrow();
    });

    it('the rendered Icon has the type of the icon prop', () => {
      expect(TestUtils.findRenderedComponentWithType(component, MockIcon).props.type)
        .toEqual('my-icon');
    });
  });
});

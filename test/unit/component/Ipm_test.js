describe('Ipm component', function() {
  let Ipm;
  const ipmPath = buildSrcPath('component/Ipm');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/IpmDesktop': {
        IpmDesktop: React.createClass({
          render() {
            return (
              <div className='ipm-desktop' />
            );
          }
        })
      }
    });
    Ipm = requireUncached(ipmPath).Ipm;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('initializes with state.ipmAvailable set to `null`', function() {
    const ipm = instanceRender(<Ipm ipmSender = {() => {}} />);

    expect(ipm.state.ipmAvailable)
      .toEqual(null);
  });

  describe('ipmSender', function() {
    let component,
      ipmSenderSpy;

    beforeEach(function() {
      ipmSenderSpy = jasmine.createSpy();

      component = shallowRender(<Ipm ipmSender={ipmSenderSpy} />);
    });

    it('should call the this.props.ipmSender', function() {
      component.props.ipmSender();

      expect(ipmSenderSpy)
        .toHaveBeenCalled();
    });
  });
});

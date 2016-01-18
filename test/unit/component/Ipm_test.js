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
    const ipm = instanceRender(<Ipm ipmSender={noop} />);

    expect(ipm.state.ipmAvailable)
      .toEqual(null);
  });

  describe('ipmSender', function() {
    it('should call the this.props.ipmSender', function() {
      const ipmSenderSpy = jasmine.createSpy();
      const component = shallowRender(<Ipm ipmSender={ipmSenderSpy} />);

      component.props.ipmSender();

      expect(ipmSenderSpy)
        .toHaveBeenCalled();
    });
  });
});

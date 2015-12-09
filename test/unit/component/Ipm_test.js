describe('Ipm component', function() {
  let Ipm,
      mockRegistry;

  const ipmPath = buildSrcPath('component/Ipm');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
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
    const ipm = React.render(
      <Ipm eventSender = {() => {}} />,
      global.document.body
    );

    expect(ipm.state.ipmAvailable)
      .toEqual(null);
  });

  describe('eventSender', function() {
    let component,
        eventSenderSpy;

    beforeEach(function() {

      eventSenderSpy = jasmine.createSpy();

      component = React.render(
        <Ipm eventSender={eventSenderSpy} />,
        global.document.body
      );
    });

    it('should call the this.props.eventSender', function() {
      component.props.eventSender();

      expect(eventSenderSpy)
        .toHaveBeenCalled();
    });
  });
});

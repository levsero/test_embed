describe('IpmDesktop component', function() {
  let IpmDesktop,
      mockRegistry,
      ipmProps,
      component,
      eventSenderSpy;

  const ipmPath = buildSrcPath('component/IpmDesktop');

  beforeEach(function() {
    ipmProps = {
      ipm: {
        id: 10017,
        type: 'ipm',
        name: 'My IPM',
        message: {
          body: 'Hi Deborah, derpy derp derp.',
          secondaryText: 'Ryan from Zendesk',
          avatarUrl: 'http://www.example.com/avatar/',
          color: '#1393d0',
          buttonText: 'Take a look!',
          buttonUrl: 'http://www.example.com'
        }
      }
    };

    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Container': {
        Container: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        }),
      },
      'component/Button': {
        Button: noopReactComponent()
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      }
    });

    IpmDesktop = requireUncached(ipmPath).IpmDesktop;

    eventSenderSpy = jasmine.createSpy();

    component = React.render(
      <IpmDesktop
        {...ipmProps}
        updateFrameSize={noop}
        eventSender={eventSenderSpy} />,
      global.document.body
    );

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    it('should call updateFrameSize', () => {
      const mockUpdateFrameSize = jasmine.createSpy();

      jasmine.clock().install();

      component = React.render(
        <IpmDesktop
          {...ipmProps}
          updateFrameSize={mockUpdateFrameSize} />,
        global.document.body
      );

      jasmine.clock().tick(0);

      expect(mockUpdateFrameSize)
        .toHaveBeenCalled();

      jasmine.clock().uninstall();
    });
  });

  describe('handleOnClick', () => {
    beforeEach(() => {
      spyOn(window, 'open');
    });

    it('should call window.open', () => {
      component.handleOnClick();

      expect(window.open)
        .toHaveBeenCalled();
    });

    it('should call window.open with props.ipm.message.buttonUrl', () => {
      component.handleOnClick();

      expect(window.open)
        .toHaveBeenCalledWith(ipmProps.ipm.message.buttonUrl, '_blank');
    });

    it('should call props.eventSender', () => {
      component.handleOnClick();

      expect(eventSenderSpy)
        .toHaveBeenCalled();
    });
  });
});

describe('IpmDesktop component', function() {
  let IpmDesktop,
    ipmProps,
    component,
    ipmSenderSpy;

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

    initMockRegistry({
      'React': React,
      'component/Container': {
        Container: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        })
      },
      'component/Button': {
        Button: noopReactComponent()
      },
      'component/Icon': {
        Icon: React.createClass({
          render: () => {
            return (
              <div className='Avatar' />
            );
          }
        })
      },
      'component/ZendeskLogo': {
        ZendeskLogo: noopReactComponent()
      }
    });

    IpmDesktop = requireUncached(ipmPath).IpmDesktop;

    ipmSenderSpy = jasmine.createSpy();

    component = React.render(
      <IpmDesktop
        {...ipmProps}
        updateFrameSize={noop}
        ipmSender={ipmSenderSpy} />,
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

    describe('#getAvatarElement', () => {
      it('returns an image when avatarUrl is passed', () => {
        component = React.render(
          <IpmDesktop
            {...ipmProps}
            updateFrameSize={noop} />,
          global.document.body
        );

        expect(document.querySelector('img').src)
          .toEqual(ipmProps.ipm.message.avatarUrl);
      });

      it('returns an Icon element when avatarUrl is falsy', () => {
        const props = _.merge({}, ipmProps, {ipm: {message:{avatarUrl: ''}}});

        component = React.render(
          <IpmDesktop
            {...props}
            updateFrameSize={noop} />,
          global.document.body
        );

        expect(document.querySelector('.Avatar'))
          .toBeTruthy();
      });
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

    it('should call props.ipmSender', () => {
      component.handleOnClick();

      expect(ipmSenderSpy)
        .toHaveBeenCalled();
    });
  });
});

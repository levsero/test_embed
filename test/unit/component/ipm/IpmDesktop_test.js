describe('IpmDesktop component', function() {
  let IpmDesktop,
    ipmProps,
    component,
    closeFrameSpy;

  const ipmPath = buildSrcPath('component/ipm/IpmDesktop');

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
      'component/button/Button': {
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

    closeFrameSpy = jasmine.createSpy();

    component = instanceRender(
      <IpmDesktop
        {...ipmProps}
        updateFrameSize={noop}
        closeFrame={noop} />
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

      shallowRender(
        <IpmDesktop
          {...ipmProps}
          updateFrameSize={mockUpdateFrameSize} />
      );

      jasmine.clock().tick(0);

      expect(mockUpdateFrameSize)
        .toHaveBeenCalled();

      jasmine.clock().uninstall();
    });

    describe('#getAvatarElement', () => {
      it('returns an image when avatarUrl is passed', () => {
        component = domRender(
          <IpmDesktop
            {...ipmProps}
            updateFrameSize={noop} />
        );

        expect(document.querySelector('img').src)
          .toEqual(ipmProps.ipm.message.avatarUrl);
      });

      it('returns an Icon element when avatarUrl is falsy', () => {
        const props = _.merge({}, ipmProps, {ipm: {message:{avatarUrl: ''}}});

        component = domRender(
          <IpmDesktop
            {...props}
            updateFrameSize={noop} />
        );

        expect(document.querySelector('.Avatar'))
          .toBeTruthy();
      });
    });
  });

  describe('#handleOnClick', () => {
    const withButtonUrl = (url) => {
      beforeEach(() => {
        ipmProps.ipm.message.buttonUrl = url;
        component = instanceRender(
          <IpmDesktop
            closeFrame={closeFrameSpy}
            {...ipmProps}  />
        );

        component.handleOnClick();
      });
    };

    beforeEach(() => {
      spyOn(window, 'open').and.returnValue({opener: {}});
    });

    describe('when ipm has an empty buttonUrl', () => {
      withButtonUrl('');

      it('does not invoke window.open', () => {
        expect(window.open)
          .not.toHaveBeenCalled();
      });

      it('closes ipm', () => {
        expect(closeFrameSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when ipm has a buttonUrl', () => {
      describe('with no protocol specified', () => {
        withButtonUrl('zendesk.com');

        it('invokes window.open with protocol relative path', () => {
          expect(window.open)
            .toHaveBeenCalledWith('//zendesk.com', '_blank');
        });
      });

      describe('with a javascript protocol specified', () => {
        withButtonUrl('javascript:alert("Hello XSS!")');

        it('does not invoke window.open', () => {
          expect(window.open)
            .not.toHaveBeenCalled();
        });
      });

      describe('with a http protocol specified', () => {
        withButtonUrl('http://zendesk.com');

        it('invokes window.open with buttonUrl as-is', () => {
          expect(window.open)
            .toHaveBeenCalledWith('http://zendesk.com', '_blank');
        });
      });

      describe('with a https protocol specified', () => {
        withButtonUrl('https://zendesk.com');

        it('invokes window.open with buttonUrl as-is', () => {
          expect(window.open)
            .toHaveBeenCalledWith('https://zendesk.com', '_blank');
        });
      });
    });
  });

  describe('ZendeskLogo', () => {
    let logo, footer, component;

    beforeEach(() => {
      component = domRender(
        <IpmDesktop {...ipmProps} />
      );
      footer = TestUtils.findRenderedDOMComponentWithClass(component, 'IpmDesktop-footer');
      logo = footer.props.children[0];
    });

    it('logoLink should be `connect`', () => {
      expect(logo.props.logoLink)
        .toEqual('connect');
    });
  });
});

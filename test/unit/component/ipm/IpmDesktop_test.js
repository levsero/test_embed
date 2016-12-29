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
          hideLogo: false,
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
      'component/Avatar': {
        Avatar: noopReactComponent()
      },
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return <div>{this.props.children}</div>;
          }
        }
      },
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return (
              <div className='Avatar' />
            );
          }
        }
      },
      'component/ZendeskLogo': {
        ZendeskLogo: class extends Component {
          render() {
            return (
              <div className='IpmDesktop-footer--logo' />
            );
          }
        }
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

      describe('with a relative url specified', () => {
        withButtonUrl('/agent/admin');

        it('invokes window.open with buttonUrl as-is', () => {
          expect(window.open)
            .toHaveBeenCalledWith('/agent/admin', '_blank');
        });
      });
    });
  });

  describe('ZendeskLogo', () => {
    let logo, footer, component;

    function renderComponent() {
      component = domRender(
        <IpmDesktop {...ipmProps} />
      );
      footer = TestUtils.findRenderedDOMComponentWithClass(component, 'IpmDesktop-footer');
      logo = footer.children[0];
    }

    beforeEach(() => {
      renderComponent();
    });

    describe('when hideLogo is false', () => {
      beforeEach(() => {
        ipmProps.ipm.message.hideLogo = false;
        renderComponent();
      });

      it('renders logo', () => {
        expect(logo.className)
          .toContain('IpmDesktop-footer--logo');
      });
    });

    describe('when hideLogo is true', () => {
      beforeEach(() => {
        ipmProps.ipm.message.hideLogo = true;
        renderComponent();
      });

      it('does not render logo', () => {
        expect(logo)
          .not.toContain('IpmDesktop-footer--logo');
      });
    });
  });
});

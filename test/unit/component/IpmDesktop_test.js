describe('IpmDesktop component', function() {
  let IpmDesktop,
      mockRegistry,
      ipmProps;

  const ipmPath = buildSrcPath('component/IpmDesktop');

  beforeEach(function() {
    ipmProps = {
      ipm: {
        id: 10017,
        message: 'Thank You',
        signOff: 'You rated us a'
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
      }
    });

    IpmDesktop = requireUncached(ipmPath).IpmDesktop;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('Container-content', () => {
    it('should have `u-paddingBL`', () => {
      const component = React.render(
        <IpmDesktop
          {...ipmProps}
          updateFrameSize={noop} />,
        global.document.body
      );

      const containerContentElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(component, 'Container-content');

      expect(containerContentElem.getDOMNode().className)
        .toMatch('u-paddingBL');
    });
  });
});

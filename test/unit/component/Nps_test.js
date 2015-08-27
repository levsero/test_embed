describe('Nps component', function() {
  let Nps,
      mockRegistry;

  const npsPath = buildSrcPath('component/Nps');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/NpsDesktop': {
        NpsDesktop: React.createClass({
          render() {
            return <div ref='nps' className='nps-desktop' />;
          }
        })
      }
    });

    Nps = requireUncached(npsPath).Nps;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should render desktop nps component by default', function() {
    const nps = React.render(
      <Nps />,
      global.document.body
    );

    expect(document.body.querySelectorAll('.nps-desktop').length)
      .toEqual(1);

    expect(nps.state.isMobile)
      .toEqual(false);
  });

  it('should render mobile nps component when isMobile is true', function() {
    const nps = React.render(
      <Nps />,
      global.document.body
    );

    expect(document.body.querySelectorAll('.nps-desktop').length)
      .toEqual(1);

    nps.setState({isMobile: true});

    expect(document.body.querySelector('div').style.background)
      .toEqual('red');

    expect(nps.state.isMobile)
      .toEqual(true);
  });
});

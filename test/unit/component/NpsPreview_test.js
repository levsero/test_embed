describe('NpsPreview component', function() {
  let NpsPreview,
      mockRegistry;

  const npsPath = buildSrcPath('component/NpsPreview');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Nps': {
        Nps: React.createClass({
          render() {
            return <div ref='nps' className='nps-desktop' />;
          }
        })
      }
    });

    NpsPreview = requireUncached(npsPath).NpsPreview;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should render desktop nps component by default', function() {
    const nps = React.render(
      <NpsPreview />,
      global.document.body
    );

    expect(document.body.querySelectorAll('.nps-desktop').length)
      .toEqual(1);

    expect(nps.state.isMobile)
      .toEqual(false);
  });

  it('should render mobile nps component when isMobile is true', function() {
    const nps = React.render(
      <NpsPreview />,
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

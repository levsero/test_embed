describe('Nps component', function() {
  let Nps,
      mockRegistry;

  const npsPath = buildSrcPath('component/Nps');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'lodash': _,
      'component/NpsDesktop': {
        NpsDesktop: React.createClass({
          render() {
            return (
              <div className='nps-desktop' />
            );
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

  it('initializes with state.surveyAvailable set to `null`', function() {
    const nps = React.render(
      <Nps npsSender = {() => {}} />,
      global.document.body
    );

    expect(nps.state.surveyAvailable)
      .toEqual(null);
  });

  it('sends the correct rating', function() {
    const npsSender = jasmine.createSpy('npsSender');
    const nps = React.render(
      <Nps npsSender={npsSender} />,
      global.document.body
    );

    const rating = 5;

    nps.setState({
      response: {
        rating: rating
      }
    });

    nps.sendRating();

    expect(npsSender)
      .toHaveBeenCalled();

    const params = npsSender.calls.mostRecent().args[0];

    expect(params.npsResponse.rating)
      .toEqual(rating);
  });

  it('sends the correct comment', function() {
    const npsSender = jasmine.createSpy('npsSender');
    const nps = React.render(
      <Nps npsSender={npsSender} />,
      global.document.body
    );

    const rating = 5;
    const comment = 'A comment';

    nps.setState({
      response: {
        rating: rating,
        comment: comment
      }
    });

    nps.sendComment();

    expect(npsSender)
      .toHaveBeenCalled();

    const params = npsSender.calls.mostRecent().args[0];

    expect(params.npsResponse.rating)
      .toEqual(rating);

    expect(params.npsResponse.comment)
      .toEqual(comment);
  });

  it('renders NpsMobile when mobile prop is true', function() {
    React.render(
      <Nps mobile={true} />,
      global.document.body
    );

    expect(document.querySelectorAll('.nps-mobile').length)
      .toEqual(1);
  });
});

describe('NpsDesktop component', function() {
  let NpsDesktop,
      mockRegistry;

  const npsPath = buildSrcPath('component/NpsDesktop');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'component/Container': {
        Container: React.createClass({
            render: function() {
              return <div>{this.props.children}</div>;
            }
          }),
      },
      'component/Button': {
        Button: noopReactComponent(),
        ButtonSecondary: noopReactComponent(),
        ButtonGroup: noopReactComponent()
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'component/FormField': {
        Field: noopReactComponent()
      },
      'component/Loading': {
        Loading: noopReactComponent()
      }
    });

    NpsDesktop = requireUncached(npsPath).NpsDesktop;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('sends the correct rating', function() {
    const npsSender = jasmine.createSpy('npsSender');
    const nps = React.render(
      <NpsDesktop npsSender={npsSender} />,
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
      <NpsDesktop npsSender={npsSender} />,
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

});

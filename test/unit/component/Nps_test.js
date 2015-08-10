describe('Nps component', function() {
  let Nps,
      mockRegistry;

  const npsPath = buildSrcPath('component/Nps');

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
      },
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['sendWithMeta'])
      }
    });

    Nps = requireUncached(npsPath).Nps;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('sends the correct score', function() {
    const transport = mockRegistry['service/transport'].transport;
    const nps = React.render(
      <Nps />,
      global.document.body
    );

    const score = 5;

    nps.setState({
      response: {
        score: score
      }
    });

    nps.sendScore();

    expect(transport.sendWithMeta)
      .toHaveBeenCalled();

    const payload = transport.sendWithMeta.calls.mostRecent().args[0];

    expect(payload.path)
      .toEqual('/embeddable/nps');

    expect(payload.params.npsResponse.score)
      .toEqual(score);
  });

  it('sends the correct comment', function() {
    const transport = mockRegistry['service/transport'].transport;
    const nps = React.render(
      <Nps />,
      global.document.body
    );

    const score = 5;
    const comment = 'A comment';

    nps.setState({
      response: {
        score: score,
        comment: comment
      }
    });

    nps.sendComment();

    expect(transport.sendWithMeta)
      .toHaveBeenCalled();

    const payload = transport.sendWithMeta.calls.mostRecent().args[0];

    expect(payload.path)
      .toEqual('/embeddable/nps');

    expect(payload.params.npsResponse.score)
      .toEqual(score);

    expect(payload.params.npsResponse.comment)
      .toEqual(comment);
  });

});

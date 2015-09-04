describe('NpsDesktop component', function() {
  let NpsDesktop,
      mockRegistry;

  const npsPath = buildSrcPath('component/NpsDesktop');

  const npsProps = {
    survey: {
      commentsQuestion: '',
      highlightColor: '',
      surveyId: null,
      logoUrl: '',
      question: '',
      recipientId: null
    },
    response: {
      rating: null,
      comment: ''
    },
    commentFieldDirty: false,
    isSubmittingRating: false,
    isSubmittingComment: false,
    surveyCompleted: false,
    surveyAvailable: null, // `null`: survey has not been set
    isMobile: false
  };

  beforeEach(function() {
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
        Button: noopReactComponent(),
        ButtonSecondary: noopReactComponent(),
        ButtonGroup: noopReactComponent()
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

  it('should render component with ordered list containing 11 items', function() {
    React.render(
      <NpsDesktop
        {...npsProps}
        ratingClickHandler={noop}
        submitCommentHandler={noop}
        onChangeHandler={noop}
        sendComment={noop} />,
      global.document.body
    );

    const ratings = document.querySelectorAll('.nps-ratings');

    expect(ratings.length)
      .toEqual(1);

    expect(ratings[0].children.length)
      .toEqual(11);
  });
});

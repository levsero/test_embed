describe('NpsDesktop component', function() {
  let NpsDesktop,
      mockRegistry,
      component,
      mockSubmitRatingHandler,
      mockSubmitCommentHandler,
      mockFocusField,
      npsProps;

  const npsPath = buildSrcPath('component/NpsDesktop');

  beforeEach(function() {
    npsProps = {
      survey: {
        commentsQuestion: 'Can you tell us why?',
        feedbackPlaceholder: 'Write your comments here...',
        highlightColor: '#77a500',
        id: 10017,
        likelyLabel: '10 = Extremely likely',
        logoUrl: null,
        notLikelyLabel: '0 = Not at all likely',
        question: 'How likely are you to recommend Embeddable Nps to someone you know?',
        recipientId: 10035,
        thankYou: 'Thank You',
        youRated: 'You rated us a'
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
        Button: noopReactComponent()
      },
      'component/FormField': {
        Field: React.createClass({
            render: () => {
              return (
                <div ref='commentField'></div>
              );
            }
          })
      },
      'component/Loading': {
        LoadingEllipses: noopReactComponent()
      },
      'component/NpsComment': {
        NpsComment: React.createClass({
          focusField: () => mockFocusField(),
          render: () => {
            return <div ref='NpsComment'></div>;
          }
        })
      },
      'component/NpsRatingsList': {
        NpsRatingsList: React.createClass({
          render: () => {
            return <div className='RatingsList--desktop'></div>;
          }
        })
      },
      'component/Icon': {
        Icon: React.createClass({
          render: () => {
            return (
              <div className='ThankYou'></div>
            );
          }
        })
      },
      'component/ZendeskLogo': {
        ZendeskLogo: React.createClass({
            render: function() {
              return <div className='ZendeskLogo'></div>;
            }
          }),
      },
      'utility/utils': {
        generateConstrastColor: noop
      },
      'service/i18n': {
        i18n: {
          t: noop,
          isRTL: noop
        }
      }
    });

    NpsDesktop = requireUncached(npsPath).NpsDesktop;

    mockSubmitRatingHandler = jasmine.createSpy();
    mockSubmitCommentHandler = jasmine.createSpy();
    mockFocusField = jasmine.createSpy();

    component = React.render(
      <NpsDesktop
        {...npsProps}
        submitRatingHandler={mockSubmitRatingHandler}
        submitCommentHandler={mockSubmitCommentHandler}
        updateFrameSize={noop}
        onChangeHandler={noop}
        sendComment={noop} />,
      global.document.body
    );
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('Container-content', () => {
    it('should have `u-paddingBL` if logo is hidden and currentPage is not addingComment', () => {
      npsProps.hideZendeskLogo = true;

      React.render(
        <NpsDesktop
          {...npsProps}
          updateFrameSize={noop} />,
        global.document.body
      );

      const containerContentElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(component, 'Container-content');

      component.setCurrentPage('selectingRating');

      expect(containerContentElem.getDOMNode().className)
        .toMatch('u-paddingBL');

      component.setCurrentPage('thankYou');

      expect(containerContentElem.getDOMNode().className)
        .toMatch('u-paddingBL');
    });
  });

  it('should set focus to npsComment first time if currentPage is addingComment', () => {
    mockFocusField.calls.reset();

    expect(mockFocusField.calls.count())
      .toEqual(0);

    component.setCurrentPage('addingComment');

    expect(mockFocusField.calls.count())
      .toEqual(1);
  });

  describe('ratingChangeValueHandler', () => {
    it('should set currentPage to addingComment when ratingChangeValueHandler is called', () => {
      component.ratingChangeValueHandler();

      const successFunc = mockSubmitRatingHandler.calls.mostRecent().args[1];

      successFunc();

      expect(component.state.currentPage.addingComment)
        .toEqual(true);
    });
  });

  describe('submitCommentHandler', () => {
    it('should set currentPage to thankYou when submitCommentHandler successFunc is called', () => {
      component.submitCommentHandler();

      const successFunc = mockSubmitCommentHandler.calls.mostRecent().args[1];

      successFunc();

      expect(component.state.currentPage.thankYou)
        .toEqual(true);
    });
  });

  describe('initial State', () => {
    it('should set the currentPage to selectingRating when initialState is called', () => {
      expect(component.state.currentPage.selectingRating)
        .toEqual(true);
    });

    it('should not set the currentPage to thankYou when initialState is called', () => {
      expect(component.state.currentPage.thankYou)
        .toEqual(false);
    });

    it('should not set the currentPage to addingComment when initialState is called', () => {
      expect(component.state.currentPage.addingComment)
        .toEqual(false);
    });
  });

  describe('selectingRating State', () => {
    it('should not render survey if params has falsy `survey.question`', () => {
      npsProps.survey.question = '';

      React.render(
        <NpsDesktop
          {...npsProps}
          updateFrameSize={noop} />,
        global.document.body
      );

      expect(document.querySelectorAll('.Container-content').length)
        .toEqual(0);
    });

    it('should render the survey if params has truthy `survey.question`', () => {
      expect(document.querySelector('.Container-content'))
        .toBeTruthy();
    });

    it('should put the provided question', () => {
      expect(document.querySelector('.Container-content').children[0].innerHTML)
        .toEqual(npsProps.survey.question);
    });

    it('should render NpsRatingsList component', () => {
      expect(document.querySelectorAll('.RatingsList--desktop').length)
        .toEqual(1);
    });

    it('should hide the comments section', () => {
      expect(document.querySelectorAll('.commentTextarea').length)
        .toEqual(0);
    });
  });

  describe('addingComment State', () => {
    beforeEach(() => {
      component.setCurrentPage('addingComment');
    });

    it('should render a survey title', () => {
      expect(document.querySelector('.Container-content').children[0])
        .toBeTruthy();
    });

    it('should render a survey title containing the provided text', () => {
      expect(document.querySelector('.Container-content').children[0].innerHTML)
        .toEqual(npsProps.survey.question);
    });

    it('should render NpsRatingsList component', () => {
      expect(document.querySelectorAll('.RatingsList--desktop').length)
        .toEqual(1);
    });

    it('should render a comments section', () => {
      expect(component.refs.npsComment)
        .toBeTruthy();
    });
  });

  describe('thankYou state', () => {
    beforeEach(() => {
      component.setCurrentPage('thankYou');
    });

    it('should hide the comments section', () => {
      expect(component.refs.npsComment.props.className)
        .toMatch('u-isHidden');
    });

    it('should render a thank you tick', () => {
      expect(document.querySelectorAll('.ThankYou').length)
        .toEqual(1);
    });

    it('should not render NpsRatingsList component', () => {
      expect(document.querySelectorAll('.RatingsList--desktop').length)
        .toEqual(0);
    });
  });
});

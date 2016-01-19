describe('NpsDesktop component', function() {
  let NpsDesktop,
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

    initMockRegistry({
      'React': React,
      'component/Container': {
        Container: React.createClass({
          render: function() {
            return <div>{this.props.children}</div>;
          }
        })
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
            return <div className='RatingsList'></div>;
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
        })
      },
      'utility/utils': {
        generateConstrastColor: noop,
        bindMethods: mockBindMethods
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

    component = domRender(
      <NpsDesktop
        {...npsProps}
        submitRatingHandler={mockSubmitRatingHandler}
        submitCommentHandler={mockSubmitCommentHandler}
        updateFrameSize={noop}
        onChangeHandler={noop}
        sendComment={noop} />
    );
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should set focus to npsComment first time if currentPage is addingComment', () => {
    mockFocusField.calls.reset();

    expect(mockFocusField.calls.count())
      .toEqual(0);

    component.setCurrentPage('addingComment');

    expect(mockFocusField.calls.count())
      .toEqual(1);
  });

  describe('Container-content', () => {
    it('should have `u-paddingBL` if logo is hidden and currentPage is not addingComment', () => {
      npsProps.hideZendeskLogo = true;

      domRender(<NpsDesktop {...npsProps} updateFrameSize={noop} />);

      const containerContentElem = ReactDOM.findDOMNode(
        TestUtils.findRenderedDOMComponentWithClass(component, 'Container-content')
      );

      component.setCurrentPage('selectingRating');

      expect(ReactDOM.findDOMNode(containerContentElem).className)
        .toMatch('u-paddingBL');

      component.setCurrentPage('thankYou');

      expect(ReactDOM.findDOMNode(containerContentElem).className)
        .toMatch('u-paddingBL');
    });
  });

  describe('ZendeskLogo', () => {
    it('should render logo if hideZendeskLogo is set to false', () => {
      npsProps.hideZendeskLogo = false;

      domRender(<NpsDesktop {...npsProps} updateFrameSize={noop} />);

      component.setCurrentPage('selectingRating');

      expect(document.querySelector('.ZendeskLogo'))
        .toBeTruthy();

      component.setCurrentPage('thankYou');

      expect(document.querySelector('.ZendeskLogo'))
        .toBeTruthy();
    });

    it('should not render logo if hideZendeskLogo is true', () => {
      npsProps.hideZendeskLogo = true;

      domRender(<NpsDesktop {...npsProps} updateFrameSize={noop} />);

      component.setCurrentPage('selectingRating');

      expect(document.querySelector('.ZendeskLogo'))
        .toBeFalsy();

      component.setCurrentPage('thankYou');

      expect(document.querySelector('.ZendeskLogo'))
        .toBeFalsy();

      component.setCurrentPage('addingComment');

      expect(document.querySelector('.ZendeskLogo'))
        .toBeFalsy();
    });

    it('should not render logo if page is addingComment', () => {
      npsProps.hideZendeskLogo = false;

      domRender(<NpsDesktop {...npsProps} updateFrameSize={noop} />);

      component.setCurrentPage('addingComment');

      expect(document.querySelector('.ZendeskLogo'))
        .toBeFalsy();
    });
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
    it('should render the survey if params has truthy `survey.question`', () => {
      expect(document.querySelector('.Container-content'))
        .toBeTruthy();
    });

    it('should put the provided question', () => {
      expect(document.querySelector('.Container-content').children[0].innerHTML)
        .toEqual(npsProps.survey.question);
    });

    it('should render NpsRatingsList component', () => {
      expect(document.querySelectorAll('.RatingsList').length)
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
        .toEqual(npsProps.survey.commentsQuestion);
    });

    it('should render NpsRatingsList component', () => {
      expect(document.querySelectorAll('.RatingsList').length)
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
      expect(document.querySelectorAll('.RatingsList').length)
        .toEqual(0);
    });
  });
});

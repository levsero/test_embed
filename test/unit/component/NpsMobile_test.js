describe('NpsMobile component', () => {
  let NpsMobile,
    mockRegistry,
    mockIsIosValue,
    component,
    npsProps,
    mockSetFrameSize,
    mockSubmitRatingHandler,
    mockSubmitCommentHandler,
    mockOnCommentChangeHandler;

  const npsPath = buildSrcPath('component/NpsMobile');

  beforeEach(() => {
    npsProps = {
      survey: {
        commentsQuestion: '',
        highlightColor: '',
        surveyId: null,
        logoUrl: '',
        question: 'question',
        recipientId: null,
        error: false,
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
      isMobile: true
    };

    resetDOM();

    mockery.enable();

    mockIsIosValue = true;

    mockRegistry = initMockRegistry({
      'React': React,
      'component/Container': {
        Container: React.createClass({
          render: function() {
            // used function instead of () => as to not reference outter 'this'
            return <div>{this.props.children}</div>;
          }
        })
      },
      'component/NpsComment': {
        NpsComment:  React.createClass({
          render: function() {
            return (
              <div ref='commentField' className={`NpsComment`}>
                <input ref='field'/>
              </div>
            );
          }
        })
      },
      'component/NpsRatingsList': {
        NpsRatingsList: React.createClass({
          render: () => {
            return (
              <div className='RatingsList'></div>
            );
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
        'ZendeskLogo': React.createClass({
          render: () => {
            return (
              <div className='ZendeskLogo'></div>
            );
          }
        })
      },
      'component/NpsSelectList': {
        'NpsSelectList': React.createClass({
          render: () => {
            return (
              <div className='NpsSelectList'></div>
            );
          }
        })
      },
      'component/NpsCommentButton': {
        'NpsCommentButton': React.createClass({
          render: () => {
            return (
              <div className='NpsCommentButton'></div>
            );
          }
        })
      },
      'utility/devices': {
        'getZoomSizingRatio': () => 1,
        'isIos': () => mockIsIosValue
      },
      'utility/globals': {
        'win': {
          innerHeight: 451
        }
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t'])
      },
      'utility/scrollHacks' : {
        setScrollKiller: noop,
        setWindowScroll: noop,
        revertWindowScroll: noop
      },
      'component/Button' : {
        Button: noopReactComponent()
      }
    });

    NpsMobile = requireUncached(npsPath).NpsMobile;

    mockSetFrameSize = jasmine.createSpy();
    mockSubmitRatingHandler = jasmine.createSpy();
    mockSubmitCommentHandler = jasmine.createSpy();
    mockOnCommentChangeHandler = jasmine.createSpy();

    component = React.render(
        <NpsMobile
          {...npsProps}
          setFrameSize={mockSetFrameSize}
          submitCommentHandler={mockSubmitCommentHandler}
          onCommentChangeHandler={mockOnCommentChangeHandler}
          submitRatingHandler={mockSubmitRatingHandler} />,
        global.document.body
      );
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('removeRatingTemplate', () => {
    it('should remove the %{rating} parameter from the string', () => {
      expect(component.removeRatingTemplate('you rated us a %{rating}'))
        .toEqual('you rated us a');
    });

    it('should return the same string if there is no %{rating} parameter', () => {
      expect(component.removeRatingTemplate('you rated us a'))
        .toEqual('you rated us a');
    });
  });

  describe('calcHeightPercentage', () => {
    describe('is less than the threshold', () => {
      beforeEach(() => {
        mockRegistry['utility/globals'].win.innerHeight = 449;
        NpsMobile = requireUncached(npsPath).NpsMobile;
      });

      it('should return 70%', () => {
        expect(component.calcHeightPercentage()).toEqual('70%');
      });

      it('should return 60% when the currentPage is thankyYou', () => {
        component.setCurrentPage('thankYou');

        expect(component.calcHeightPercentage()).toEqual('60%');
      });
    });

    describe('is greater than the threshold', () => {
      it('should return 52%', () => {
        expect(component.calcHeightPercentage()).toEqual('52%');
      });

      it('should return 40% when the currentPage is thankyYou', () => {
        component.setCurrentPage('thankYou');

        expect(component.calcHeightPercentage()).toEqual('40%');
      });
    });
  });

  describe('ratingChangeValueHandler', () => {
    it('should set currentPage to addingComment when ratingChangeValueHandler is called', () => {
      component.ratingChangeValueHandler();

      let successFunc = mockSubmitRatingHandler.calls.mostRecent().args[1];

      successFunc();

      expect(component.state.currentPage.addingComment)
        .toEqual(true);
    });
  });

  describe('submitCommentHandler', () => {
    let mockStopEditing;

    beforeEach(() => {
      mockStopEditing = jasmine.createSpy();

      component.stopEditing = mockStopEditing;
    });

    it('should set currentPage to thankYou when submitCommentHandler successFunc is called', () => {
      component.submitCommentHandler();

      let successFunc = mockSubmitCommentHandler.calls.mostRecent().args[1];

      successFunc();

      expect(component.state.currentPage.thankYou)
        .toEqual(true);
    });

    it('should call stopEditing when submitCommentHandler successFunc is called', () => {
      component.submitCommentHandler();

      let successFunc = mockSubmitCommentHandler.calls.mostRecent().args[1];

      successFunc();

      expect(mockStopEditing)
        .toHaveBeenCalled();
    });
  });

  describe('initial State', () => {
    it('should set the currentPage to selectingRating when initialState is called', () => {
      expect(component.state.currentPage.selectingRating)
        .toEqual(true);
    });
  });

  describe('selectingRating State', () => {
    it('should not render a heading', () => {
      expect(document.querySelector('.Container--halfscreen-heading').textContent)
        .toEqual('');
    });

    it('should render the survey question', () => {
      expect(document.querySelectorAll('.SurveyQuestion').length)
        .toEqual(1);
    });

    it('should put the provided question', () => {
      expect(document.querySelector('.SurveyQuestion').textContent)
        .toEqual(npsProps.survey.question);
    });

    it('should render the ratings list', () => {
      expect(document.querySelector('.RatingsList'))
        .not.toEqual(null);
    });

    it('should hide the comments section', () => {
      expect(document.querySelectorAll('.u-isHidden .NpsCommentButton').length)
        .toEqual(1);
    });
  });

  describe('addingComment State', () => {
    beforeEach(() => {
      component.setCurrentPage('addingComment');
    });

    it('should render a heading', () => {
      expect(document.querySelectorAll('.Container--halfscreen-heading').length)
        .toEqual(1);
    });

    it('should render a heading containing the provided text', () => {
      expect(document.querySelector('.Container--halfscreen-heading').textContent)
        .toEqual(npsProps.survey.youRated);
    });

    it('should render a select list', () => {
      expect(document.querySelectorAll('.NpsSelectList').length)
        .toEqual(1);
    });

    it('should render a comments section', () => {
      expect(document.querySelectorAll('.NpsCommentButton').length)
        .toEqual(1);
    });
  });

  describe('thankYou state', () => {
    beforeEach(() => {
      component.setCurrentPage('thankYou');
    });

    it('should hide the comments section', () => {
      expect(document.querySelectorAll('.u-isHidden .NpsCommentButton').length)
        .toEqual(1);
    });

    it('should render a thank you tick', () => {
      expect(document.querySelectorAll('.ThankYou').length)
        .toEqual(1);
    });

    it('should render ZendeskLogo', () => {
      expect(document.querySelectorAll('.ZendeskLogo').length)
        .toEqual(1);
    });
  });

  describe('isEditing', () => {
    describe('is false and currentPage is addingComment', () => {
      beforeEach(() => {
        component.setState({
          isEditing: false
        });
        component.setCurrentPage('addingComment');
      });

      it('should render a NpsCommentButton', () => {
        expect(document.querySelectorAll('.NpsCommentButton').length)
          .toEqual(1);
      });
    });
    describe('is true and currentPage is addingComment', () => {
      beforeEach(() => {
        component.componentDidUpdate = noop;
        component.setState({
          isEditing: true
        });
        component.setCurrentPage('addingComment');
      });

      it('should render a NpsCommentButton', () => {
        expect(document.querySelectorAll('.NpsComment').length)
          .toEqual(1);
      });
    });
  });

  describe('goToFullScreen', () => {
    let mockStartScrollHacks;

    beforeEach(() => {
      mockStartScrollHacks = jasmine.createSpy();

      component.componentDidUpdate = noop;
      component.startScrollHacks = mockStartScrollHacks;
    });
    it('should set fullscreen to true', () => {
      component.goToFullScreen();

      expect(component.state.fullscreen)
        .toEqual(true);
    });

    it('should call startScrollHacks', () => {
      component.goToFullScreen();

      expect(component.startScrollHacks)
        .toHaveBeenCalled();
    });
  });

  describe('resetFullScreen', () => {
    let mockStopScrollHacks,
      mockSetDefaultNpsMobileSize;

    beforeEach(() => {
      mockStopScrollHacks = jasmine.createSpy();
      mockSetDefaultNpsMobileSize = jasmine.createSpy();

      component.componentDidUpdate = noop;
      component.stopScrollHacks = mockStopScrollHacks;
      component.setDefaultNpsMobileSize = mockSetDefaultNpsMobileSize;
    });
    it('should set fullscreen to false', () => {
      component.resetFullScreen();

      expect(component.state.fullscreen)
        .toEqual(false);
    });

    it('should call stopScrollHacks', () => {
      component.resetFullScreen();

      expect(component.stopScrollHacks)
        .toHaveBeenCalled();
    });

    it('should call setDefaultNpsMobileSize', () => {
      component.resetFullScreen();

      expect(component.setDefaultNpsMobileSize)
        .toHaveBeenCalled();
    });
  });

  describe('startEditing', () => {
    describe('non IOS device', () => {
      let mockGoToFullScreen;

      beforeEach(() => {
        mockGoToFullScreen = jasmine.createSpy('mockGoToFullScreen');
        mockIsIosValue = false;

        component.componentDidUpdate = noop;

        component.goToFullScreen = mockGoToFullScreen;
      });

      it('should not call goToFullScreen', () => {
        component.startEditing();

        expect(mockGoToFullScreen)
          .not.toHaveBeenCalled();
      });
    });

    describe('IOS device', () => {
      let mockGoToFullScreen;

      beforeEach(() => {
        mockGoToFullScreen = jasmine.createSpy();

        component.componentDidUpdate = noop;
        component.goToFullScreen = mockGoToFullScreen;
      });

      it('should not call goToFullScreen', () => {
        component.startEditing();

        expect(mockGoToFullScreen)
          .toHaveBeenCalled();
      });
    });
  });

  describe('stopEditing', () => {
    describe('non IOS device', () => {
      let mockResetFullScreen;

      beforeEach(() => {
        mockIsIosValue = false;
        mockResetFullScreen = jasmine.createSpy('mockResetFullScreen');

        component.resetFullScreen = mockResetFullScreen;
      });

      it('should not call resetFullScreen', () => {
        component.stopEditing();

        expect(mockResetFullScreen)
          .not.toHaveBeenCalled();
      });
    });

    describe('IOS device', () => {
      let mockResetFullScreen;

      beforeEach(() => {
        mockResetFullScreen = jasmine.createSpy();

        component.resetFullScreen = mockResetFullScreen;
      });

      it('should not call resetFullScreen', () => {
        component.stopEditing();

        expect(mockResetFullScreen)
          .toHaveBeenCalled();
      });
    });
  });

  it('should not render a ZendeskLogo on initial state', () => {
    expect(document.querySelectorAll('.ZendeskLogo').length)
      .toEqual(0);
  });
});

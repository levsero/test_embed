describe('NpsMobile component', () => {
  let NpsMobile,
      mockRegistry,
      component,
      npsProps;

  let innerSpy = jasmine.createSpy();
  let mockSetFrameSize = jasmine.createSpy();
  let mockRatingClickHandler = jasmine.createSpy().and.returnValue(innerSpy);
  let mockSubmitCommentHandler = jasmine.createSpy();
  let mockOnCommentChangeHandler = jasmine.createSpy();
  let mockSendComment = jasmine.createSpy();

  const npsPath = buildSrcPath('component/NpsMobile');
  const mockRating = 0;
  const npsPageStates = {
    selectingRating: 0,
    addingComment: 1,
    thankYou: 2
  };

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

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Container': {
        Container: React.createClass({
            render: function() {
              //used function instead of () => as to not reference outter 'this'
              return <div>{this.props.children}</div>;
            }
          }),
      },
      'component/NpsComment': {
        NpsComment:  React.createClass({
          render: () => {
            return (
              <div className='NpsComment'></div>
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
      'component/SelectList': {
        'SelectList': React.createClass({
          render: () => {
            return (
              <div className='SelectList'></div>
            );
          }
        })
      },
      'utility/devices': {
        'getSizingRatio': () => 1
      },
      'utility/globals': {
        'win': {
          innerHeight: 451
        }
      },
      'service/i18n': {
        'i18n': {
          t: noop
        }
      }
    });

    NpsMobile = requireUncached(npsPath).NpsMobile;

    component = React.render(
        <NpsMobile
          {...npsProps}
          setFrameSize={mockSetFrameSize}
          ratingClickHandler={mockRatingClickHandler}
          submitCommentHandler={mockSubmitCommentHandler}
          onCommentChangeHandler={mockOnCommentChangeHandler}
          sendComment={mockSendComment}
        />,
        global.document.body
      );
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
    innerSpy = innerSpy = jasmine.createSpy();
    mockSetFrameSize = jasmine.createSpy();
    mockRatingClickHandler = jasmine.createSpy().and.returnValue(innerSpy);
    mockSubmitCommentHandler = jasmine.createSpy();
    mockOnCommentChangeHandler = jasmine.createSpy();
    mockSendComment = jasmine.createSpy();
  });

  describe('CalcHeightPercentage', () => {

    describe('is less than the threshold', () => {

      beforeEach(() => {
        mockRegistry['utility/globals'].win.innerHeight = 449;
        NpsMobile = requireUncached(npsPath).NpsMobile;
      });

      it('should return 70%', () => {
        expect(component.calcHeightPercentage()).toEqual('70%');
      });

      it('should return 60% when the currentPage is thankyYou', () => {
        component.setState({
          currentPage: npsPageStates.thankYou
        });

        expect(component.calcHeightPercentage()).toEqual('60%');
      });

    });
    describe('is greater than the threshold', () => {

      it('should return 51%', () => {
        expect(component.calcHeightPercentage()).toEqual('51%');
      });

      it('should return 40% when the currentPage is thankyYou', () => {
        component.setState({
          currentPage: npsPageStates.thankYou
        });

        expect(component.calcHeightPercentage()).toEqual('40%');
      });

    });

  });

  describe('RatingClickHandler', () => {

    it('should return a function when ratingClickHandler is called', () => {
      expect(typeof component.ratingClickHandler(mockRating))
        .toEqual('function');
    });

    it(`should set currentPage to addingComment
      when ratingClickHandlerSuccess is called`, () => {
        component.ratingClickHandlerSuccess();

        expect(component.state.currentPage)
         .toEqual(npsPageStates.addingComment);
      });

  });
  describe('SubmitCommentHandler', () => {

    it('should set currentPage to thankYou when submitCommentHandlerSuccess is called', () => {
      component.submitCommentHandlerSuccess();

      expect(component.state.currentPage)
        .toEqual(npsPageStates.thankYou);
    });

  });

  describe('Initial State', () => {

    it('should set the currentPage to selectingRating when initialState is called', () => {
      expect(component.state.currentPage)
        .toEqual(npsPageStates.selectingRating);
    });

  });

  describe('IsCurrentPage', () => {

    it('Should return true when the provided page matches the states currentPage', () => {
      expect(component.isCurrentPage(npsPageStates.selectingRating))
        .toEqual(true);
    });

    it(`Should return false when the provided page
     does not match the states currentPage`, () => {
       expect(component.isCurrentPage(npsPageStates.thankYou))
         .toEqual(false);
     });

  });

  describe('SelectingRating State', () => {

    it('should not render a heading', () => {
      expect(document.querySelectorAll('.Container--halfscreen-heading')[0].textContent)
        .toEqual('');
    });

    it('should render the survey question', () => {
      expect(document.querySelectorAll('.SurveyQuestion').length)
        .toEqual(1);
    });

    it('should put the provided question', () => {
      expect(document.querySelectorAll('.SurveyQuestion')[0].textContent)
        .toEqual(npsProps.survey.question);
    });

    it('should render the ratings list', () => {
      expect(document.querySelector('.RatingsList'))
        .not.toEqual(null);
    });

  });

  describe('AddingComment State', () => {

    beforeEach(() => {

      component.setState({
        currentPage: npsPageStates.addingComment
      });
    });

    it('should render a heading', () => {
      expect(document.querySelectorAll('.Container--halfscreen-heading').length)
        .toEqual(1);
    });

    it('should render a heading containg the provided text', () => {
      expect(document.querySelectorAll('.Container--halfscreen-heading')[0].textContent)
        .toEqual(npsProps.survey.youRated);
    });

    it('should render a select list', () => {
      expect(document.querySelectorAll('.SelectList').length)
        .toEqual(1);
    });

    it('should render a comments section', () => {
      expect(document.querySelectorAll('.NpsComment').length)
        .toEqual(1);
    });

  });

  describe('ThankYou State', () => {

    beforeEach(() => {
      component.setState({
        currentPage: npsPageStates.thankYou
      });
    });

    it('should render a thank you tick', () => {
      expect(document.querySelectorAll('.ThankYou').length)
        .toEqual(1);
    });
  });

  it('should render a ZendeskLogo', () => {
    expect(document.querySelectorAll('.ZendeskLogo').length)
      .toEqual(1);
  });

});

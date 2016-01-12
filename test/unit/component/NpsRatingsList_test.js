describe('NpsRatingsList component', () => {
  let NpsRatingsList,
    component,
    ratingsRange,
    npsRatingsListProps;

  const npsPath = buildSrcPath('component/NpsRatingsList');

  beforeEach(() => {
    ratingsRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    npsRatingsListProps = {
      likelyLabel:'10 = Extremely likely',
      notLikelyLabel:'0 = Not likely',
      ratingsRange:ratingsRange,
      selectedRating: null,
      isSubmittingRating: false,
      highlightColor: '',
      onClick: noop,
      highlightButton: true
    };

    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Button': {
        'ButtonRating': React.createClass({
          render: () => {
            return (
              <div className='ButtonRating'></div>
            );
          }
        })
      },
      'utility/utils': {
        'generateConstrastColor': jasmine.createSpy()
      }
    });

    NpsRatingsList = requireUncached(npsPath).NpsRatingsList;

    component = React.render(
        <NpsRatingsList {...npsRatingsListProps} />,
        global.document.body
      );
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('list items', () => {
    it('should render an unordered list of items', () => {
      expect(document.querySelectorAll('.RatingsList')[0].children.length)
        .toEqual(ratingsRange.length);
    });

    it('should render a list using rating buttons', () => {
      expect(document.querySelectorAll('.ButtonRating').length)
        .toEqual(ratingsRange.length);
    });
  });

  describe('labels', () => {
    it('should render both labels', () => {
      expect(document.querySelectorAll('.u-size1of2').length)
        .toEqual(2);
    });

    it('should render the likelyLabel', () => {
      expect(document
          .querySelectorAll('.u-size1of2.u-inlineBlock.u-textRight')[0]
          .textContent
        )
        .toEqual(npsRatingsListProps.likelyLabel);
    });

    it('should render the notLikelyLabel', () => {
      expect(document
        .querySelectorAll('.u-size1of2.u-inlineBlock.u-textLeft')[0]
        .textContent
      )
      .toEqual(npsRatingsListProps.notLikelyLabel);
    });

    describe('notLikely', () => {
      it('should be prepended with "0 = "', () => {
        expect(component.addRatingToNotLikelyLabel('Not at all likely'))
          .toEqual('0 = Not at all likely');
      });

      it('should not be prepended with "0 = "', () => {
        expect(component.addRatingToNotLikelyLabel('0 = Not at all likely'))
          .toEqual('0 = Not at all likely');
      });
    });

    describe('likely', () => {
      it('should be prepended with "10 = "', () => {
        expect(component.addRatingToLikelyLabel('Extremely likely'))
          .toEqual('10 = Extremely likely');
      });

      it('should not be prepended with "10 = "', () => {
        expect(component.addRatingToLikelyLabel('10 = Extremely likely'))
          .toEqual('10 = Extremely likely');
      });
    });
  });
});

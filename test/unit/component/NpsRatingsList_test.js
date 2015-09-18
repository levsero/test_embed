describe('NpsRatingsList component', () => {
  let NpsRatingsList,
      mockRegistry,
      component,
      ratingsRange,
      npsRatingsListProps;

  const npsPath = buildSrcPath('component/NpsRatingsList');

  beforeEach(() => {

    ratingsRange = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    npsRatingsListProps = {
      likelyLabel:'',
      notLikelyLabel:'',
      ratingsRange:ratingsRange,
      selectedRating: null,
      isSubmittingRating: false,
      highlightColor: '',
      onClick: noop,
      highlightButton: true
    };

    resetDOM();

    mockery.enable();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Button': {
        'RatingButton': React.createClass({
          render: () => {
            return (
              <div className='RatingButton'></div>
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
      expect(document.querySelectorAll('.RatingButton').length)
        .toEqual(ratingsRange.length);
    });

  });

  describe('labels', () => {

    it('should render the notLikelyLabel', () => {
      expect(document.querySelectorAll('.RatingsList-legend-text--left')[0].textContent)
        .toEqual(npsRatingsListProps.notLikelyLabel);
    });

    it('should render the likelyLabel', () => {
      expect(document.querySelectorAll('.RatingsList-legend-text--left')[0].textContent)
        .toEqual(npsRatingsListProps.likelyLabel);
    });

  });

});

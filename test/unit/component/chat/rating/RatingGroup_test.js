describe('RatingGroup component', () => {
  let RatingGroup,
    ChatRatings;
  const RatingGroupPath = buildSrcPath('component/chat/rating/RatingGroup');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'component/button/ButtonIcon': {
        ButtonIcon: class extends Component {
          render = () => {
            return (
              <div className={`${this.props.icon} ${this.props.className}`} />
            );
          }
        }
      },
      './RatingGroup.scss': {
        locals: {
          ratingIconActive: 'ratingIconActive',
          ratingIcon: 'ratingIcon',
          leftRatingIcon: 'leftRatingIcon',
          container: 'container',
          thumbDownIcon: 'thumbDownIcon'
        }
      }
    });

    mockery.registerAllowable(RatingGroupPath);
    RatingGroup = requireUncached(RatingGroupPath).RatingGroup;
    ChatRatings = requireUncached(RatingGroupPath).ratings;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let RatingGroupNode;

    describe('when the rating value is good', () => {
      beforeEach(() => {
        const component = domRender(<RatingGroup rating={ChatRatings.GOOD} />);

        RatingGroupNode = ReactDOM.findDOMNode(component);
      });

      it('renders active styles for thumbUp button', () => {
        const buttonIconNode = RatingGroupNode.querySelector('.Icon--thumbUp');

        expect(buttonIconNode.className)
          .toContain('ratingIconActive');
      });

      it('does not render active styles for thumbDown button', () => {
        const buttonIconNode = RatingGroupNode.querySelector('.Icon--thumbDown');

        expect(buttonIconNode.className)
          .not.toContain('ratingIconActive');
      });
    });

    describe('when the rating value is bad', () => {
      beforeEach(() => {
        const component = domRender(<RatingGroup rating={ChatRatings.BAD} />);

        RatingGroupNode = ReactDOM.findDOMNode(component);
      });

      it('renders active styles for thumbDown button', () => {
        const buttonIconNode = RatingGroupNode.querySelector('.Icon--thumbDown');

        expect(buttonIconNode.className)
          .toContain('ratingIconActive');
      });

      it('does not render active styles for thumbDown button', () => {
        const buttonIconNode = RatingGroupNode.querySelector('.Icon--thumbUp');

        expect(buttonIconNode.className)
          .not.toContain('ratingIconActive');
      });
    });

    describe('when the rating value is falsy', () => {
      let thumbUpNode,
        thumbDownNode;

      beforeEach(() => {
        const component = domRender(<RatingGroup />);

        RatingGroupNode = ReactDOM.findDOMNode(component);
        thumbUpNode = RatingGroupNode.querySelector('.Icon--thumbUp');
        thumbDownNode = RatingGroupNode.querySelector('.Icon--thumbDown');
      });

      it('renders both buttons without active styles', () => {
        expect(thumbUpNode)
          .not.toContain('ratingIconActive');

        expect(thumbDownNode)
          .not.toContain('ratingIconActive');
      });
    });

    describe('when rtl is false', () => {
      let RatingGroupChildren;

      beforeEach(() => {
        const component = domRender(<RatingGroup />);

        RatingGroupChildren = ReactDOM.findDOMNode(component).children;
      });

      describe('thumbs up icon', () => {
        it('renders first', () => {
          expect(RatingGroupChildren[0].className)
            .toContain('Icon--thumbUp');
        });

        it('has leftRatingIcon classes', () => {
          expect(RatingGroupChildren[0].className)
            .toContain('leftRatingIcon');
        });
      });

      describe('thumbs down icon', () => {
        it('renders second', () => {
          expect(RatingGroupChildren[1].className)
            .toContain('Icon--thumbDown');
        });

        it('has ratingIcon classes', () => {
          expect(RatingGroupChildren[1].className)
            .toContain('ratingIcon');
        });
      });
    });

    describe('when rtl is true', () => {
      let RatingGroupChildren;

      beforeEach(() => {
        const component = domRender(<RatingGroup rtl={true} />);

        RatingGroupChildren = ReactDOM.findDOMNode(component).children;
      });

      describe('thumbs up icon', () => {
        it('renders second', () => {
          expect(RatingGroupChildren[1].className)
            .toContain('Icon--thumbUp');
        });

        it('has ratingIcon classes', () => {
          expect(RatingGroupChildren[1].className)
            .toContain('ratingIcon');
        });
      });

      describe('thumbs down icon', () => {
        it('renders first', () => {
          expect(RatingGroupChildren[0].className)
            .toContain('Icon--thumbDown');
        });

        it('has leftRatingIcon classes', () => {
          expect(RatingGroupChildren[0].className)
            .toContain('leftRatingIcon');
        });
      });
    });
  });

  describe('ratingClickedHandler', () => {
    let component,
      mockUpdateRating,
      mockRating;

    describe('when an existing rating does not exist', () => {
      beforeEach(() => {
        mockUpdateRating = jasmine.createSpy('updateRating');
        mockRating = ChatRatings.GOOD;

        component = instanceRender(<RatingGroup updateRating={mockUpdateRating} />);
        component.ratingClickedHandler(mockRating);
      });

      it('calls updateRating with the new rating', () => {
        expect(mockUpdateRating)
          .toHaveBeenCalledWith(mockRating);
      });
    });

    describe('when an existing rating exists', () => {
      beforeEach(() => {
        mockUpdateRating = jasmine.createSpy('updateRating');
        mockRating = ChatRatings.GOOD;

        component = instanceRender(
          <RatingGroup
            rating={mockRating}
            updateRating={mockUpdateRating} />
        );
      });

      it('calls updateRating with the new rating for a different', () => {
        component.ratingClickedHandler(ChatRatings.BAD);

        expect(mockUpdateRating)
          .toHaveBeenCalledWith(ChatRatings.BAD);
      });

      it('calls updateRating with null for the same rating', () => {
        component.ratingClickedHandler(mockRating);

        expect(mockUpdateRating)
          .toHaveBeenCalledWith(null);
      });
    });
  });
});

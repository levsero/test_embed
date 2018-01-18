describe('ChatRatingGroup component', () => {
  let ChatRatingGroup,
    ChatRatings;
  const chatRatingGroupPath = buildSrcPath('component/chat/ChatRatingGroup');

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
      './ChatRatingGroup.scss': {
        locals: {
          ratingIconActive: 'ratingIconActive',
          ratingIcon: 'ratingIcon',
          leftRatingIcon: 'leftRatingIcon',
          container: 'container',
          thumbDownIcon: 'thumbDownIcon'
        }
      }
    });

    mockery.registerAllowable(chatRatingGroupPath);
    ChatRatingGroup = requireUncached(chatRatingGroupPath).ChatRatingGroup;
    ChatRatings = requireUncached(chatRatingGroupPath).ChatRatings;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let chatratingGroupNode;

    describe('when the rating value is good', () => {
      beforeEach(() => {
        const component = domRender(<ChatRatingGroup rating={ChatRatings.GOOD} />);

        chatratingGroupNode = ReactDOM.findDOMNode(component);
      });

      it('renders active styles for thumbUp button', () => {
        const buttonIconNode = chatratingGroupNode.querySelector('.Icon--thumbUp');

        expect(buttonIconNode.className)
          .toContain('ratingIconActive');
      });

      it('does not render active styles for thumbDown button', () => {
        const buttonIconNode = chatratingGroupNode.querySelector('.Icon--thumbDown');

        expect(buttonIconNode.className)
          .not.toContain('ratingIconActive');
      });
    });

    describe('when the rating value is bad', () => {
      beforeEach(() => {
        const component = domRender(<ChatRatingGroup rating={ChatRatings.BAD} />);

        chatratingGroupNode = ReactDOM.findDOMNode(component);
      });

      it('renders active styles for thumbDown button', () => {
        const buttonIconNode = chatratingGroupNode.querySelector('.Icon--thumbDown');

        expect(buttonIconNode.className)
          .toContain('ratingIconActive');
      });

      it('does not render active styles for thumbDown button', () => {
        const buttonIconNode = chatratingGroupNode.querySelector('.Icon--thumbUp');

        expect(buttonIconNode.className)
          .not.toContain('ratingIconActive');
      });
    });

    describe('when the rating value is falsy', () => {
      let thumbUpNode,
        thumbDownNode;

      beforeEach(() => {
        const component = domRender(<ChatRatingGroup />);

        chatratingGroupNode = ReactDOM.findDOMNode(component);
        thumbUpNode = chatratingGroupNode.querySelector('.Icon--thumbUp');
        thumbDownNode = chatratingGroupNode.querySelector('.Icon--thumbDown');
      });

      it('renders both buttons without active styles', () => {
        expect(thumbUpNode)
          .not.toContain('ratingIconActive');

        expect(thumbDownNode)
          .not.toContain('ratingIconActive');
      });
    });

    describe('when rtl is false', () => {
      let chatRatingGroupChildren;

      beforeEach(() => {
        const component = domRender(<ChatRatingGroup />);

        chatRatingGroupChildren = ReactDOM.findDOMNode(component).children;
      });

      describe('thumbs up icon', () => {
        it('renders first', () => {
          expect(chatRatingGroupChildren[0].className)
            .toContain('Icon--thumbUp');
        });

        it('has leftRatingIcon classes', () => {
          expect(chatRatingGroupChildren[0].className)
            .toContain('leftRatingIcon');
        });
      });

      describe('thumbs down icon', () => {
        it('renders second', () => {
          expect(chatRatingGroupChildren[1].className)
            .toContain('Icon--thumbDown');
        });

        it('has ratingIcon classes', () => {
          expect(chatRatingGroupChildren[1].className)
            .toContain('ratingIcon');
        });
      });
    });

    describe('when rtl is true', () => {
      let chatRatingGroupChildren;

      beforeEach(() => {
        const component = domRender(<ChatRatingGroup rtl={true} />);

        chatRatingGroupChildren = ReactDOM.findDOMNode(component).children;
      });

      describe('thumbs up icon', () => {
        it('renders second', () => {
          expect(chatRatingGroupChildren[1].className)
            .toContain('Icon--thumbUp');
        });

        it('has ratingIcon classes', () => {
          expect(chatRatingGroupChildren[1].className)
            .toContain('ratingIcon');
        });
      });

      describe('thumbs down icon', () => {
        it('renders first', () => {
          expect(chatRatingGroupChildren[0].className)
            .toContain('Icon--thumbDown');
        });

        it('has leftRatingIcon classes', () => {
          expect(chatRatingGroupChildren[0].className)
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

        component = instanceRender(<ChatRatingGroup updateRating={mockUpdateRating} />);
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
          <ChatRatingGroup
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

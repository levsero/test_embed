describe('ChatRatingGroup component', () => {
  let ChatRatingGroup;
  const chatRatingGroupPath = buildSrcPath('component/chat/ChatRatingGroup');

  beforeEach(() => {
    resetDOM();
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
      './ChatRatingGroup.sass': {
        locals: {
          ratingIconActive: 'ratingIconActive',
          ratingIcon: 'ratingIcon',
          container: 'container',
          thumbDownIcon: 'thumbDownIcon'
        }
      }
    });

    mockery.registerAllowable(chatRatingGroupPath);
    ChatRatingGroup = requireUncached(chatRatingGroupPath).ChatRatingGroup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let chatratingGroupNode;

    describe('when the rating value is good', () => {
      beforeEach(() => {
        const component = domRender(<ChatRatingGroup rating='good' />);

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
        const component = domRender(<ChatRatingGroup rating='bad' />);

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
  });

  describe('ratingClickedHandler', () => {
    let component,
      mockUpdateRating,
      mockRating;

    describe('when an existing rating does not exist', () => {
      beforeEach(() => {
        mockUpdateRating = jasmine.createSpy('updateRating');
        mockRating = 'good';

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
        mockRating = 'good';

        component = instanceRender(
          <ChatRatingGroup
            rating={mockRating}
            updateRating={mockUpdateRating} />
        );
      });

      it('calls updateRating with the new rating for a different', () => {
        component.ratingClickedHandler('bad');

        expect(mockUpdateRating)
          .toHaveBeenCalledWith('bad');
      });

      it('calls updateRating with null for the same rating', () => {
        component.ratingClickedHandler(mockRating);

        expect(mockUpdateRating)
          .toHaveBeenCalledWith(null);
      });
    });
  });
});

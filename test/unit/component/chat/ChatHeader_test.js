describe('ChatHeader component', () => {
  let ChatHeader;
  const chatHeaderPath = buildSrcPath('component/chat/ChatHeader');

  class MockAvatar extends React.Component {
    render() {
      return <div className='Avatar' />;
    }
  }

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      'component/Avatar': {
        Avatar: MockAvatar
      },
      'component/button/ButtonSecondary': {
        ButtonSecondary: noopReactComponent()
      },
      'component/button/ButtonIcon': {
        ButtonIcon: class extends Component {
          render = () => {
            return (
              <div className={`${this.props.icon} ${this.props.className}`} />
            );
          }
        }
      },
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      './ChatHeader.sass': {
        locals: {
          container: 'container',
          textContainer: 'textContainer',
          ratingIconActive: 'ratingIconActive'
        }
      }
    });

    mockery.registerAllowable(chatHeaderPath);
    ChatHeader = requireUncached(chatHeaderPath).ChatHeader;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#render', () => {
    let component;

    beforeEach(() => {
      const agents = {
        'agent:111': {
          'avatar_path': 'https://example.com/snake',
          'display_name': 'Luke Skywalker',
          'title': 'Jedi'
        }
      };

      component = domRender(<ChatHeader agents={agents} />);
    });

    it('should render an Avatar', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, MockAvatar))
        .not.toThrow();
    });

    describe('agents prop', () => {
      it('should use the agents name as the title', () => {
        const titleElem = document.querySelector('.textContainer').firstChild;

        expect(titleElem.innerHTML)
          .toEqual('Luke Skywalker');
      });

      it('should use the agents title as the subText', () => {
        const subTextElem = document.querySelector('.textContainer').childNodes[1];

        expect(subTextElem.innerHTML)
          .toEqual('Jedi');
      });

      it('should pass the avatar_path to the avatar component', () => {
        const avatar = TestUtils.findRenderedComponentWithType(component, MockAvatar);

        expect(avatar.props.src)
          .toEqual('https://example.com/snake');
      });
    });
  });

  describe('renderRatingButton', () => {
    let chatHeaderNode;

    describe('when the rating value is good', () => {
      beforeEach(() => {
        const component = domRender(<ChatHeader rating='good' />);

        chatHeaderNode = ReactDOM.findDOMNode(component);
      });

      it('should render active styles for thumbUp button', () => {
        const buttonIconNode = chatHeaderNode.querySelector('.Icon--thumbUp');

        expect(buttonIconNode.className)
          .toContain('ratingIconActive');
      });

      it('should not render active styles for thumbDown button', () => {
        const buttonIconNode = chatHeaderNode.querySelector('.Icon--thumbDown');

        expect(buttonIconNode.className)
          .not.toContain('ratingIconActive');
      });
    });

    describe('when the rating value is bad', () => {
      beforeEach(() => {
        const component = domRender(<ChatHeader rating='bad' />);

        chatHeaderNode = ReactDOM.findDOMNode(component);
      });

      it('should render active styles for thumbDown button', () => {
        const buttonIconNode = chatHeaderNode.querySelector('.Icon--thumbDown');

        expect(buttonIconNode.className)
          .toContain('ratingIconActive');
      });

      it('should not render active styles for thumbDown button', () => {
        const buttonIconNode = chatHeaderNode.querySelector('.Icon--thumbUp');

        expect(buttonIconNode.className)
          .not.toContain('ratingIconActive');
      });
    });

    describe('when the rating value is falsy', () => {
      let thumbUpNode,
        thumbDownNode;

      beforeEach(() => {
        const component = domRender(<ChatHeader />);

        chatHeaderNode = ReactDOM.findDOMNode(component);
        thumbUpNode = chatHeaderNode.querySelector('.Icon--thumbUp');
        thumbDownNode = chatHeaderNode.querySelector('.Icon--thumbDown');
      });

      it('should render both buttons without active styles', () => {
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

        component = instanceRender(<ChatHeader updateRating={mockUpdateRating} />);
        component.ratingClickedHandler(mockRating);
      });

      it('should call updateRating with the new rating', () => {
        expect(mockUpdateRating)
          .toHaveBeenCalledWith(mockRating);
      });
    });

    describe('when an existing rating exists', () => {
      beforeEach(() => {
        mockUpdateRating = jasmine.createSpy('updateRating');
        mockRating = 'good';

        component = instanceRender(
          <ChatHeader
            rating={mockRating}
            updateRating={mockUpdateRating} />
        );
      });

      it('should call updateRating with the new rating for a different', () => {
        component.ratingClickedHandler('bad');

        expect(mockUpdateRating)
          .toHaveBeenCalledWith('bad');
      });

      it('should call updateRating with null for the same rating', () => {
        component.ratingClickedHandler(mockRating);

        expect(mockUpdateRating)
          .toHaveBeenCalledWith(null);
      });
    });
  });
});

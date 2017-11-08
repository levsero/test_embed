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
      'component/chat/ChatRatingGroup': {
        ChatRatingGroup: noopReactComponent()
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
      const props = {
        avatar: 'https://example.com/snake',
        title: 'Luke Skywalker',
        byline: 'Jedi'
      };

      component = domRender(<ChatHeader {...props} />);
    });

    it('should render an Avatar', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, MockAvatar))
        .not.toThrow();
    });

    describe('props', () => {
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
});

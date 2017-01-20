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
      'service/i18n': {
        i18n: {
          t: noop
        }
      },
      './ChatHeader.sass': {
        locals: {
          container: 'container',
          textContainer: 'textContainer'
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
});

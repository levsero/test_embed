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

    describe('when passing props', () => {
      it('should render props.title as `Foo`', () => {
        const titleElem = document.querySelector('.textContainer').firstChild;

        expect(titleElem.innerHTML)
          .toEqual('Luke Skywalker');
      });

      it('should render props.subText as `Bar`', () => {
        const subTextElem = document.querySelector('.textContainer').childNodes[1];

        expect(subTextElem.innerHTML)
          .toEqual('Jedi');
      });
    });
  });
});

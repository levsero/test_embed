describe('ChatHeader component', () => {
  let ChatHeader,
    mockIsIE;
  const chatHeaderPath = buildSrcPath('component/ChatHeader');

  class MockAvatar extends React.Component {
    render() {
      return <div className='Avatar' />;
    }
  }

  mockIsIE = false;

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      'component/Avatar': {
        Avatar: MockAvatar
      },
      'utility/devices': {
        isIE: () => mockIsIE
      },
      'service/i18n': {
        i18n: {
          t: (i18nKey, { fallback }) => fallback
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
    mockIsIE = false;
  });

  describe('#render', () => {
    let component;

    beforeEach(() => {
      component = domRender(<ChatHeader />);
    });

    it('should render an Avatar', () => {
      expect(() => TestUtils.findRenderedComponentWithType(component, MockAvatar))
        .not.toThrow();
    });

    describe('when passing props', () => {
      it('should render props.title as `Foo`', () => {
        component = domRender(<ChatHeader title='foo' />);

        const titleElem = document.querySelector('.textContainer').firstChild;

        expect(titleElem.innerHTML)
          .toEqual('Foo');
      });

      it('should render props.subText as `Bar`', () => {
        component = domRender(<ChatHeader subText='bar' />);

        const subTextElem = document.querySelector('.textContainer').childNodes[1];

        expect(subTextElem.innerHTML)
          .toEqual('Bar');
      });
    });
  });
});

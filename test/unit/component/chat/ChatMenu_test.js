describe('ChatMenu component', () => {
  let ChatMenu;
  const chatMenuPath = buildSrcPath('component/chat/ChatMenu');

  beforeEach(() => {
    resetDOM();
    mockery.enable();

    initMockRegistry({
      './ChatMenu.sass': {
        locals: {}
      },
      'service/i18n': {
        i18n: {
          t: (_, { fallback }) => fallback
        }
      }
    });

    mockery.registerAllowable(chatMenuPath);
    ChatMenu = requireUncached(chatMenuPath).ChatMenu;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('props', () => {
    describe('endChatOnClick', () => {
      let endChatOnClickSpy;

      describe('when the container has been clicked', () => {
        beforeEach(() => {
          endChatOnClickSpy = jasmine.createSpy();

          const component = domRender(<ChatMenu endChatOnClick={endChatOnClickSpy} />);
          const componentNode = ReactDOM.findDOMNode(component);

          componentNode.lastChild.click();
        });

        it('calls endChatOnClick', () => {
          expect(endChatOnClickSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when the container has not been clicked', () => {
        beforeEach(() => {
          endChatOnClickSpy = jasmine.createSpy();

          domRender(<ChatMenu endChatOnClick={endChatOnClickSpy} />);
        });

        it('does not call endChatOnClick', () => {
          expect(endChatOnClickSpy)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});

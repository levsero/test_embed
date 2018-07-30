describe('ChatOffline component', () => {
  let Chat,
    handleDragEnterSpy = jasmine.createSpy('handleDragEnter');
  const ChatPath = buildSrcPath('component/chat/Chat');

  const ChatOffline = noopReactComponent();
  const ChatOnline = noopReactComponent();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'component/chat/ChatOffline': ChatOffline,
      'component/chat/ChatOnline': ChatOnline,
      'src/redux/modules/chat/chat-selectors': {
        getShowOfflineChat: ''
      }
    });

    mockery.registerAllowable(ChatPath);
    Chat = requireUncached(ChatPath).default.WrappedComponent;
  });

  afterEach(() => {
    handleDragEnterSpy.calls.reset();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let component;

    describe('when props.showOfflineChat is true', () => {
      beforeEach(() => {
        component = domRender(
          <Chat
            showOfflineChat={true} />
        );
      });

      it('renders ChatOffline component', () => {
        expect(TestUtils.isElementOfType(component.renderChatOffline(), ChatOffline))
          .toEqual(true);
      });

      it('does not render ChatOnline component', () => {
        expect(component.renderChatOnline())
          .toBeFalsy();
      });

      describe('getActiveComponent', () => {
        let active;

        beforeEach(() => {
          active = component.getActiveComponent();
        });

        it('returns the offline component', () => {
          expect(TestUtils.isCompositeComponentWithType(active, ChatOffline))
            .toEqual(true);
        });
      });

      describe('handleDragEnter', () => {
        beforeEach(() => {
          component.handleDragEnter();
        });

        it('does not call handleDragEnterSpy', () => {
          expect(handleDragEnterSpy)
            .not
            .toHaveBeenCalled();
        });
      });
    });

    describe('when props.showOfflineForm is false', () => {
      beforeEach(() => {
        component = domRender(
          <Chat
            showOfflineForm={false} />
        );
      });

      it('renders ChatOnline component', () => {
        expect(TestUtils.isElementOfType(component.renderChatOnline(), ChatOnline))
          .toEqual(true);
      });

      it('does not render ChatOffline component', () => {
        expect(component.renderChatOffline())
          .toBeFalsy();
      });

      describe('getActiveComponent', () => {
        let active;

        beforeEach(() => {
          active = component.getActiveComponent();
        });

        it('returns the online component', () => {
          expect(TestUtils.isCompositeComponentWithType(active, ChatOnline))
            .toEqual(true);
        });
      });

      describe('handleDragEnter', () => {
        beforeEach(() => {
          component.online = {
            getWrappedInstance: () => {
              return {
                handleDragEnter: handleDragEnterSpy
              };
            }
          };
          component.handleDragEnter();
        });

        it('does call handleDragEnterSpy', () => {
          expect(handleDragEnterSpy)
            .toHaveBeenCalled();
        });
      });
    });
  });
});

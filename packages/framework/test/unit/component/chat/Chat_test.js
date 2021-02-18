describe('Chat component', () => {
  let Chat,
    handleDragEnterSpy = jasmine.createSpy('handleDragEnter')
  const ChatPath = buildSrcPath('component/chat/Chat')

  const ChatOffline = noopReactComponent()
  const ChatOnline = noopReactComponent()
  const LoadingPage = noopReactComponent()

  beforeEach(() => {
    mockery.enable()

    initMockRegistry({
      'embeds/chat/components/ChatOffline': ChatOffline,
      'component/chat/ChatOnline': ChatOnline,
      'components/LoadingPage': LoadingPage,
      'src/redux/modules/chat/chat-selectors': {
        getShowOfflineChat: '',
      },
      'src/redux/modules/base': {
        cancelButtonClicked: noop,
      },
      'src/component/chat/chatting/chatHistoryScreen': {},
    })

    mockery.registerAllowable(ChatPath)
    Chat = requireUncached(ChatPath).default.WrappedComponent
  })

  afterEach(() => {
    handleDragEnterSpy.calls.reset()
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('render', () => {
    let component

    describe('when props.showOfflineChat is true', () => {
      beforeEach(() => {
        component = domRender(<Chat showOfflineChat={true} hasSdkConnected={true} />)
      })

      it('renders ChatOffline component', () => {
        expect(TestUtils.isElementOfType(component.renderChatOffline(), ChatOffline)).toEqual(true)
      })

      it('does not render ChatOnline component', () => {
        expect(component.renderChatOnline()).toBeFalsy()
      })

      describe('handleDragEnter', () => {
        beforeEach(() => {
          component.handleDragEnter()
        })

        it('does not call handleDragEnterSpy', () => {
          expect(handleDragEnterSpy).not.toHaveBeenCalled()
        })
      })
    })

    describe('when props.showOfflineForm is false', () => {
      beforeEach(() => {
        component = domRender(<Chat showOfflineForm={false} hasSdkConnected={true} />)
      })

      it('renders ChatOnline component', () => {
        expect(TestUtils.isElementOfType(component.renderChatOnline(), ChatOnline)).toEqual(true)
      })

      it('does not render ChatOffline component', () => {
        expect(component.renderChatOffline()).toBeFalsy()
      })

      describe('handleDragEnter', () => {
        beforeEach(() => {
          component.online = {
            handleDragEnter: handleDragEnterSpy,
          }
          component.handleDragEnter()
        })

        it('does call handleDragEnterSpy', () => {
          expect(handleDragEnterSpy).toHaveBeenCalled()
        })
      })
    })
  })
})

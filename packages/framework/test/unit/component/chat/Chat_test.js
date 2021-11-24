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
      'src/embeds/chat/components/ChatOffline': ChatOffline,
      'src/component/chat/ChatOnline': ChatOnline,
      'src/components/LoadingPage': LoadingPage,
      'src/embeds/chat/selectors': {
        getShowOfflineChat: '',
      },
      'src/redux/modules/base': {
        cancelButtonClicked: noop,
      },
      'src/component/chat/chatting/chatHistoryScreen': {},
      '@zendesk/widget-shared-services': {
        isMobileBrowser: noop,
      },
      'src/redux/modules/selectors': {
        getHideZendeskLogo: noop,
      },
      'src/redux/modules/base/base-selectors': {
        getChannelChoiceAvailable: noop,
        getHelpCenterAvailable: noop,
        getHideZendeskLogo: noop,
      },
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

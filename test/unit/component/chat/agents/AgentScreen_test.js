describe('AgentScreen component', () => {
  let AgentScreen

  const chatPath = buildSrcPath('component/chat/agents/AgentScreen')

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen')

  const Button = noopReactComponent('Button')
  const ZendeskLogo = noopReactComponent('ZendeskLogo')

  beforeEach(() => {
    mockery.enable()

    initMockRegistry({
      './AgentScreen.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          scrollContainerMessagesContent: 'scrollContainerMessagesContentClass',
          scrollContainerMessagesContentDesktop: 'scrollContainerMessagesContentDesktopClass',
          scrollContainerContent: 'scrollContainerContentClasses',
          agentListBackButton: 'agentListBackButtonClasses',
          logoFooter: 'logoFooterClasses',
          zendeskLogo: 'zendeskLogoClasses',
          agentListBackButtonWithLogo: 'agentListBackButtonWithLogoClasses'
        }
      },
      '@zendeskgarden/react-buttons': {
        Button
      },
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/chat/agents/AgentList': {
        AgentList: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'src/redux/modules/chat': {
        updateChatScreen: updateChatScreenSpy
      },
      'src/redux/modules/selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/chat/chat-selectors': {},
      'src/redux/modules/chat/chat-history-selectors': {
        getHasMoreHistory: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        CHATTING_SCREEN: 'CHATTING_SCREEN'
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      }
    })

    mockery.registerAllowable(chatPath)
    AgentScreen = requireUncached(chatPath).default.WrappedComponent
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()

    updateChatScreenSpy.calls.reset()
  })

  describe('render', () => {
    let component,
      isMobile = false,
      fullscreen = false,
      hideZendeskLogo = false

    beforeEach(() => {
      component = instanceRender(
        <AgentScreen
          isMobile={isMobile}
          fullscreen={fullscreen}
          hideZendeskLogo={hideZendeskLogo}
          updateChatScreen={updateChatScreenSpy}
        />
      ).render().props.children[0]
    })

    describe('the scroll container wrapper', () => {
      beforeAll(() => {
        isMobile = false
      })

      it('has its containerClasses prop to the scrollContainerContent style', () => {
        expect(component.props.containerClasses).toEqual('scrollContainerContentClasses')
      })

      describe('when fullscreen and ismobile are true', () => {
        beforeAll(() => {
          isMobile = true
          fullscreen = true
        })

        afterAll(() => {
          isMobile = false
          fullscreen = false
        })

        it('has the correct prop for fullscreen', () => {
          expect(component.props.fullscreen).toEqual(true)
        })

        it('has the correct prop for isMobile', () => {
          expect(component.props.isMobile).toEqual(true)
        })
      })

      describe('the footerContent', () => {
        let footerContent

        beforeEach(() => {
          footerContent = component.props.footerContent
        })

        it('is a button', () => {
          expect(TestUtils.isElementOfType(footerContent, Button)).toEqual(true)
        })

        it('has its className set to agentListBackButton', () => {
          expect(footerContent.props.className).toContain('agentListBackButtonClasses')
        })

        it('has its label set correctly', () => {
          expect(footerContent.props.children).toEqual(
            'embeddable_framework.chat.agentList.button.backToChat'
          )
        })

        describe('the onClick prop', () => {
          beforeEach(() => {
            footerContent.props.onClick()
          })

          it('calls updateChatScreen with chatting screen', () => {
            expect(updateChatScreenSpy).toHaveBeenCalledWith('CHATTING_SCREEN')
          })
        })
      })
    })

    describe('hideZendeskLogo', () => {
      describe('when hideZendeskLogo is false', () => {
        it('renders footer with correct class', () => {
          expect(component.props.footerContent.props.className).toContain(
            'agentListBackButtonWithLogoClasses'
          )
        })
      })

      describe('when hideZendeskLogo is true', () => {
        beforeAll(() => {
          hideZendeskLogo = true
        })

        it('renders footer with correct class', () => {
          expect(component.props.footerContent.props.className).not.toContain(
            'agentListBackButtonWithLogoClasses'
          )
        })
      })
    })
  })
})

describe('ChattingFooter component', () => {
  let ChattingFooter,
    i18n,
    mockIsRTL = false
  const ChattingFooterPath = buildSrcPath('component/chat/chatting/ChattingFooter')
  const IconButton = noopReactComponent()
  const Icon = noopReactComponent()
  const ChatMenu = noopReactComponent()
  const FooterIconButton = noopReactComponent()

  beforeEach(() => {
    mockery.enable()

    i18n = {
      t: jasmine.createSpy().and.callFake(key => {
        return key
      }),
      isRTL: () => mockIsRTL
    }

    initMockRegistry({
      'service/i18n': {
        i18n
      },
      './ChattingFooter.scss': {
        locals: {
          iconContainer: 'iconsClass',
          containerMobile: 'containerMobileClass',
          iconEndChat: 'iconEndChatClass',
          iconDisabled: 'iconDisabledClasses',
          iconAttachment: 'iconAttachmentClass',
          iconAttachmentMobile: 'iconAttachmentMobileClass',
          iconMenu: 'iconMenuClass',
          iconSendChatMobile: 'iconSendChatMobileClass'
        }
      },
      'component/Dropzone': {
        Dropzone: noopReactComponent()
      },
      'embeds/chat/components/FooterIconButton': FooterIconButton,
      'utility/globals': {
        TEST_IDS: {
          CHAT_MENU: 'chat-menu'
        }
      },
      'utility/devices': {
        isMobileBrowser: () => false
      },
      'embeds/chat/components/ChatMenu': ChatMenu,
      'constants/shared': {
        ICONS: {},
        TEST_IDS: {}
      },
      'component/Icon': { Icon },
      '@zendeskgarden/react-buttons': { IconButton }
    })

    mockery.registerAllowable(ChattingFooterPath)
    ChattingFooter = requireUncached(ChattingFooterPath).ChattingFooter
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('render', () => {
    let component, componentNode

    it('renders the chat menu', () => {
      component = domRender(<ChattingFooter />)

      expect(() => TestUtils.findRenderedComponentWithType(component, ChatMenu)).not.toThrow()
    })

    describe('icons', () => {
      beforeEach(() => {
        component = domRender(<ChattingFooter />)
        componentNode = ReactDOM.findDOMNode(component)
      })

      it('renders the chat footer with styled icons', () => {
        expect(componentNode.querySelector('.iconsClass')).toBeTruthy()
      })
    })

    describe('on non-mobile devices', () => {
      let result

      beforeEach(() => {
        component = instanceRender(<ChattingFooter isMobile={false} />)
        result = component.render()
      })

      it('renders the desktop version', () => {
        expect(result.props.className).not.toContain('containerMobileClass')
      })
    })

    describe('on mobile devices', () => {
      let result

      beforeEach(() => {
        component = instanceRender(<ChattingFooter isMobile={true} />)
        result = component.render()
      })

      it('renders the mobile version', () => {
        expect(result.props.className).toContain('containerMobileClass')
      })
    })
  })

  describe('renderEndChatOption', () => {
    it('is disabled when props.isChatting is false', () => {
      const component = domRender(<ChattingFooter isChatting={false} />)

      expect(
        TestUtils.findRenderedComponentWithType(component, FooterIconButton).props.disabled
      ).toBe(true)
    })

    it('is not disabled when when props.isChatting is true', () => {
      const component = domRender(<ChattingFooter isChatting={true} />)

      expect(
        TestUtils.findRenderedComponentWithType(component, FooterIconButton).props.disabled
      ).toBe(false)
    })
  })

  describe('renderAttachmentOption', () => {
    let result

    describe('when props.attachmentsEnabled is true', () => {
      beforeEach(() => {
        const component = instanceRender(<ChattingFooter attachmentsEnabled={true} />)

        result = component.renderAttachmentOption()
      })

      it('returns the attachment option', () => {
        expect(result).toBeTruthy()
      })
    })

    describe('when props.attachmentsEnabled is false', () => {
      beforeEach(() => {
        const component = instanceRender(<ChattingFooter attachmentsEnabled={false} />)

        result = component.renderAttachmentOption()
      })

      it('returns null', () => {
        expect(result).toBeNull()
      })
    })
  })

  describe('renderSendChatOption', () => {
    let result, sendChatSpy

    beforeEach(() => {
      sendChatSpy = jasmine.createSpy()
      const component = instanceRender(<ChattingFooter sendChat={sendChatSpy} />)

      result = component.renderSendChatOption()
    })

    it('has correct classes', () => {
      expect(result.props.className).toContain('iconSendChatMobileClass')
    })

    it('passes sendChat to onClick handler', () => {
      expect(result.props.onClick).toBe(sendChatSpy)
    })
  })

  describe('handleMenuClick', () => {
    let component, stopPropagationSpy, toggleMenuSpy

    beforeEach(() => {
      stopPropagationSpy = jasmine.createSpy()
      toggleMenuSpy = jasmine.createSpy()

      component = instanceRender(<ChattingFooter showIcons={true} toggleMenu={toggleMenuSpy} />)
      component.handleMenuClick({ stopPropagation: stopPropagationSpy })
    })

    it('calls stopPropagation on the event', () => {
      expect(stopPropagationSpy).toHaveBeenCalled()
    })

    it('calls props.toggleMenu', () => {
      expect(toggleMenuSpy).toHaveBeenCalled()
    })
  })

  describe('handleEndChatClick', () => {
    let component, endChatSpy

    beforeEach(() => {
      endChatSpy = jasmine.createSpy()
    })

    describe('when props.isChatting is false', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingFooter isChatting={false} endChat={endChatSpy} />)

        component.handleEndChatClick('some event')
      })

      it('does not call props.endChat', () => {
        expect(endChatSpy).not.toHaveBeenCalled()
      })
    })

    describe('when props.isChatting is true', () => {
      beforeEach(() => {
        component = instanceRender(<ChattingFooter isChatting={true} endChat={endChatSpy} />)

        component.handleEndChatClick('some event')
      })

      it('calls props.endChat', () => {
        expect(endChatSpy).toHaveBeenCalledWith('some event')
      })
    })
  })
})

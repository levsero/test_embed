describe('ChattingFooter component', () => {
  let ChattingFooter,
    i18n,
    mockIsRTL = false
  const ChattingFooterPath = buildSrcPath('component/chat/chatting/ChattingFooter')
  const IconButton = noopReactComponent()
  const Icon = noopReactComponent()

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
      'constants/shared': {
        ICONS: {}
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
    let classNames

    describe('when props.isChatting is false', () => {
      beforeEach(() => {
        const component = instanceRender(<ChattingFooter isChatting={false} />)

        const result = component.renderEndChatOption()
        const triggerSpy = jasmine.createSpy('spy')
        result.props.children.props.trigger({ getTriggerProps: triggerSpy, ref: {} })
        classNames = triggerSpy.calls.first().args[0].className
      })

      it('has disabled classes', () => {
        expect(classNames).toContain('iconEndChatClass')
        expect(classNames).toContain('iconDisabledClasses')
      })
    })

    describe('when props.isChatting is true', () => {
      beforeEach(() => {
        const component = instanceRender(<ChattingFooter isChatting={true} />)

        const result = component.renderEndChatOption()

        const triggerSpy = jasmine.createSpy('spy')
        result.props.children.props.trigger({ getTriggerProps: triggerSpy, ref: {} })
        classNames = triggerSpy.calls.first().args[0].className
      })

      it('does not have disabled classes', () => {
        expect(classNames).toContain('iconEndChatClass')
        expect(classNames).not.toContain('iconDisabledClasses')
      })
    })
  })

  describe('renderAttachmentOption', () => {
    let result, classNames

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

    describe('on non-mobile devices', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChattingFooter attachmentsEnabled={true} isMobile={false} />
        )

        result = component.renderAttachmentOption()

        const triggerSpy = jasmine.createSpy('spy')
        const triggerFunction = result.props.children.props.children.props.trigger
        triggerFunction({ getTriggerProps: triggerSpy, ref: {} })
        classNames = triggerSpy.calls.first().args[0].className
      })

      it('does not have mobile specific classes', () => {
        expect(classNames).toContain('iconAttachmentClass')
        expect(classNames).not.toContain('iconAttachmentMobileClass')
      })
    })

    describe('on mobile devices', () => {
      beforeEach(() => {
        const component = instanceRender(
          <ChattingFooter attachmentsEnabled={true} isMobile={true} />
        )

        result = component.renderAttachmentOption()

        const triggerSpy = jasmine.createSpy('spy')
        const triggerFunction = result.props.children.props.children.props.trigger
        triggerFunction({ getTriggerProps: triggerSpy, ref: {} })
        classNames = triggerSpy.calls.first().args[0].className
      })

      it('has mobile specific classes', () => {
        expect(classNames).toContain('iconAttachmentClass')
        expect(classNames).toContain('iconAttachmentMobileClass')
      })
    })
  })

  describe('renderMenuOption', () => {
    let classNames

    beforeEach(() => {
      const component = instanceRender(<ChattingFooter />)

      const result = component.renderMenuOption()

      const triggerSpy = jasmine.createSpy('spy')
      result.props.children.props.trigger({ getTriggerProps: triggerSpy, ref: {} })
      classNames = triggerSpy.calls.first().args[0].className
    })

    it('has correct classes', () => {
      expect(classNames).toContain('iconMenuClass')
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

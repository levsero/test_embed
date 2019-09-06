describe('ChatBox component', () => {
  let ChatBox
  let locale = 'en'
  let isIos = false
  let TEST_IDS
  const chatBoxPath = buildSrcPath('component/chat/chatting/ChatBox')
  const sharedConstantsPath = basePath('src/constants/shared')

  beforeEach(() => {
    mockery.enable()

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    initMockRegistry({
      './ChatBox.scss': {
        locals: {
          input: 'input',
          inputMobile: 'inputMobile'
        }
      },
      'component/field/Field': {
        Field: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          t: noop,
          getLocale: () => locale
        }
      },
      '@zendeskgarden/react-textfields': {
        TextField: noopReactComponent(),
        Label: noopReactComponent(),
        Textarea: noopReactComponent()
      },
      'utility/keyboard': {
        keyCodes: {
          a: 65,
          ENTER: 13
        }
      },
      'utility/devices': { isIos: () => isIos },
      'src/constants/shared': {
        TEST_IDS
      }
    })

    mockery.registerAllowable(chatBoxPath)
    ChatBox = requireUncached(chatBoxPath).ChatBox
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('handleChange', () => {
    let component, updateCurrentMsgSpy

    beforeEach(() => {
      updateCurrentMsgSpy = jasmine.createSpy()
      component = instanceRender(<ChatBox handleChatBoxChange={updateCurrentMsgSpy} />)

      component.handleChange({ target: { value: '!' } })
    })

    it('calls handleChatBoxChange prop', () => {
      expect(updateCurrentMsgSpy).toHaveBeenCalledWith('!')
    })
  })

  describe('handleKeyDown', () => {
    const keyCodes = { enter: 13, a: 65 }
    let component, sendChatSpy
    let event = { keyCode: keyCodes.enter, preventDefault: () => false }

    beforeEach(() => {
      sendChatSpy = jasmine.createSpy()
      component = instanceRender(<ChatBox sendChat={sendChatSpy} />)
    })

    describe('when the user presses <Enter>', () => {
      describe('when shift is _not_ pressed simultaneously', () => {
        it('interprets it as a send signal and sends the message', () => {
          component.handleKeyDown(event)

          expect(sendChatSpy).toHaveBeenCalled()
        })
      })

      describe('when shift _is_ pressed simultaneously', () => {
        it('does not send the message and enters a line break', () => {
          event = _.merge(event, { shiftKey: true })
          component.handleKeyDown(event)

          expect(sendChatSpy).not.toHaveBeenCalled()
        })
      })
    })

    describe('when the user presses any other key', () => {
      it('does not send the message', () => {
        event = _.merge(event, { keyCode: keyCodes.a })
        component.handleKeyDown(event)

        expect(sendChatSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('handleInput', () => {
    let component

    describe('when locale is set to `ja` and the user is on iOS Safari', () => {
      beforeEach(() => {
        locale = 'ja'
        isIos = true
        component = domRender(<ChatBox />)
        component.textArea = {
          scrollIntoViewIfNeeded: jasmine.createSpy('scrollIntoViewIfNeeded')
        }
      })

      it('triggers scrollIntoViewIfNeeded on the textArea', () => {
        component.handleInput()

        expect(component.textArea.scrollIntoViewIfNeeded).toHaveBeenCalled()
      })
    })

    describe('when locale is set to `ja` and the user is not on iOS Safari', () => {
      beforeEach(() => {
        locale = 'ja'
        isIos = false
        component = domRender(<ChatBox />)
        component.textArea = {
          scrollIntoViewIfNeeded: jasmine.createSpy('scrollIntoViewIfNeeded')
        }
      })

      it('does not triggers scrollIntoViewIfNeeded on the textArea', () => {
        component.handleInput()

        expect(component.textArea.scrollIntoViewIfNeeded).not.toHaveBeenCalled()
      })
    })

    describe('when locale is set to `en` and the user is on iOS Safari', () => {
      beforeEach(() => {
        locale = 'en'
        isIos = true
        component = domRender(<ChatBox />)
        component.textArea = {
          scrollIntoViewIfNeeded: jasmine.createSpy('scrollIntoViewIfNeeded')
        }
      })

      it('does not triggers scrollIntoViewIfNeeded on the textArea', () => {
        component.handleInput()

        expect(component.textArea.scrollIntoViewIfNeeded).not.toHaveBeenCalled()
      })
    })
  })

  describe('chatBoxTextarea', () => {
    let component, textarea

    describe('on non-mobile devices', () => {
      beforeEach(() => {
        component = domRender(<ChatBox isMobile={false} />)

        textarea = component.render().props.children.props.children[1]
      })

      it('has 3 rows', () => {
        expect(textarea.props.rows).toBe(3)
      })
    })

    describe('on mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChatBox isMobile={true} />)

        textarea = component.render().props.children.props.children[1]
      })

      it('has 1 row', () => {
        expect(textarea.props.rows).toBe(1)
      })
    })
  })

  describe('Field component', () => {
    let component, field

    describe('on non-mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChatBox isMobile={false} />)
        field = component.render().props.children.props.children[1]
      })

      it('passes correct classnames to Field', () => {
        expect(field.props.className).toContain('input')
        expect(field.props.className).not.toContain('inputMobile')
      })
    })

    describe('on mobile devices', () => {
      beforeEach(() => {
        component = instanceRender(<ChatBox isMobile={true} />)
        field = component.render().props.children.props.children[1]
      })

      it('passes correct classnames to Field', () => {
        expect(field.props.className).toContain('input inputMobile')
      })
    })
  })
})

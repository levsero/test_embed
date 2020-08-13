describe('ChatBadge component', () => {
  let ChatBadge,
    ICONS,
    mockLocale = 'en',
    mockIsRTL = false,
    component,
    sendMsgSpy = jasmine.createSpy('sendMsg'),
    onSendSpy = jasmine.createSpy('onSend'),
    TEST_IDS

  const chatBadgePath = buildSrcPath('component/launcher/ChatBadge')
  const sharedConstantsPath = buildSrcPath('constants/shared')

  const Icon = class extends Component {
    render() {
      return <div className={this.props.className}>{this.props.type}</div>
    }
  }

  beforeEach(() => {
    mockery.enable()

    ICONS = requireUncached(sharedConstantsPath).ICONS
    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    initMockRegistry({
      'component/Icon': {
        Icon
      },
      './ChatBadge.scss': {
        locals: {
          splashPadding: 'splashPadding',
          splashDisplayContainer: 'splashDisplayContainer',
          textOnLeft: 'textOnLeft',
          textOnRight: 'textOnRight',
          textOnly: 'textOnly',
          chatIcon: 'chatIcon',
          customImg: 'customImg',
          customImgOnly: 'customImgOnly',
          imgOnly: 'imgOnly',
          imgRight: 'imgRight',
          imgLeft: 'imgLeft'
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          getLocale: () => mockLocale,
          isRTL: () => mockIsRTL
        }
      },
      '@zendeskgarden/react-forms': {
        Input: noopReactComponent()
      },
      'embeds/webWidget/components/BaseFrame/FrameStyleContext': {
        FrameStyle: noopReactComponent()
      },
      '@zendeskgarden/svg-icons/src/16/dash-fill.svg': noopReactComponent(),
      'icons/widget-icon_sendChat.svg': noopReactComponent(),
      'src/redux/modules/selectors': {
        getChatOnline: noop
      },
      'src/redux/modules/chat/chat-selectors': {
        getCurrentMessage: noop,
        getBannerSettings: noop
      },
      'src/redux/modules/base/': {
        launcherClicked: noop
      },
      'utility/keyboard': {
        triggerOnEnter: noop
      },
      'constants/shared': {
        ICONS,
        TEST_IDS
      },
      'src/redux/modules/chat': {
        sendMsg: sendMsgSpy,
        handleChatBadgeMessageChange: noop
      },
      'src/redux/modules/base': {
        handleChatBadgeMinimize: noop
      }
    })

    ChatBadge = requireUncached(chatBadgePath).default.WrappedComponent
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
    sendMsgSpy.calls.reset()
    onSendSpy.calls.reset()
  })

  describe('renderLabel', () => {
    let result,
      mockBannerSettings = {}

    beforeEach(() => {
      component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />)
      result = component.renderLabel()
    })

    describe('when layout is image_right', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'image_right'
      })

      it('renders textOnLeft class', () => {
        expect(result.props.className).toContain('textOnLeft')
      })
    })

    describe('when layout is image_left', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'image_left'
      })

      it('renders textOnRight class', () => {
        expect(result.props.className).toContain('textOnRight')
      })
    })

    describe('when layout is text_only', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'text_only'
      })

      it('renders textOnly class', () => {
        expect(result.props.className).toContain('textOnly')
      })
    })
  })

  describe('renderImage', () => {
    let result,
      mockBannerSettings = {}

    beforeEach(() => {
      component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />)
      result = component.renderImage()
    })

    describe('when custom image is present', () => {
      beforeAll(() => {
        mockBannerSettings.image = 'http://img.com/img.png'
      })

      it('renders custom image', () => {
        expect(TestUtils.isElementOfType(result.props.children, 'img')).toEqual(true)
      })

      describe('when layout is image_only', () => {
        beforeAll(() => {
          mockBannerSettings.layout = 'image_only'
        })

        it('renders customImgOnly class', () => {
          expect(result.props.children.props.className).toContain('customImgOnly')
        })
      })

      describe('when layout is not image_only', () => {
        describe('when layout aligns the image to the right', () => {
          beforeAll(() => {
            mockBannerSettings.layout = 'image_right'
          })

          it('renders customImg class', () => {
            expect(result.props.children.props.className).toContain('customImg')
          })

          it('renders the imgRight class', () => {
            expect(result.props.children.props.className).toContain('imgRight')
          })
        })

        describe('when layout aligns the image to the left', () => {
          beforeAll(() => {
            mockBannerSettings.layout = 'image_left'
          })

          it('renders the imgLeft class', () => {
            expect(result.props.children.props.className).toContain('imgLeft')
          })
        })
      })
    })

    describe('when custom image is not present', () => {
      beforeAll(() => {
        mockBannerSettings.image = ''
      })

      it('renders an SVG icon', () => {
        expect(TestUtils.isElementOfType(result.props.children, Icon)).toEqual(true)
      })

      it('renders the SVG icon classes', () => {
        expect(result.props.children.props.className).toContain('chatIcon')
      })

      describe('and layout is image_only', () => {
        beforeAll(() => {
          mockBannerSettings.layout = 'image_only'
        })

        it('renders an "imgOnly" class', () => {
          expect(result.props.children.props.className).toContain('imgOnly')
        })
      })
    })
  })

  describe('renderContent', () => {
    let result,
      mockBannerSettings = {}

    describe('when layout is image_right', () => {
      beforeEach(() => {
        mockBannerSettings.layout = 'image_right'
        component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />)
        result = component.renderContent()
      })

      it('calls renderLabel then renderImage', () => {
        expect(result[0].key).toEqual('label')
        expect(result[1].key).toEqual('image')
      })
    })

    describe('when layout is image_left', () => {
      beforeEach(() => {
        mockBannerSettings.layout = 'image_left'
        component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />)
        result = component.renderContent()
      })

      it('calls renderImage then renderLabel', () => {
        expect(result[0].key).toEqual('image')
        expect(result[1].key).toEqual('label')
      })
    })

    describe('when layout is text_only', () => {
      beforeEach(() => {
        mockBannerSettings.layout = 'text_only'
        component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />)
        spyOn(component, 'renderLabel')
        spyOn(component, 'renderImage')
        result = component.renderContent()
      })

      it('calls renderLabel only', () => {
        expect(component.renderLabel).toHaveBeenCalled()
        expect(component.renderImage).not.toHaveBeenCalled()
      })
    })

    describe('when layout is image_only', () => {
      beforeEach(() => {
        mockBannerSettings.layout = 'image_only'
        component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />)
        spyOn(component, 'renderLabel')
        spyOn(component, 'renderImage')
        result = component.renderContent()
      })

      it('calls renderImage only', () => {
        expect(component.renderLabel).not.toHaveBeenCalled()
        expect(component.renderImage).toHaveBeenCalled()
      })
    })
  })

  describe('renderSplashDisplay', () => {
    let result,
      mockBannerSettings = {}

    beforeEach(() => {
      component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />)
      result = component.renderSplashDisplay()
    })

    describe('when layout is image_only', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'image_only'
      })

      it('does not render splashPadding display class', () => {
        expect(result.props.className).not.toContain('splashPadding')
      })
    })

    describe('when layout is image_right', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'image_right'
      })

      it('renders splashPadding display class', () => {
        expect(result.props.className).toContain('splashPadding')
      })
    })
  })

  describe('sendChatMsg', () => {
    let mockMessage,
      mockEvent = {
        preventDefault: () => {}
      }

    beforeEach(() => {
      component = instanceRender(
        <ChatBadge currentMessage={mockMessage} sendMsg={sendMsgSpy} onSend={onSendSpy} />
      )
      component.sendChatMsg(mockEvent)
    })

    describe('when there is no message', () => {
      beforeAll(() => {
        mockMessage = ''
      })

      it('does not send message', () => {
        expect(sendMsgSpy).not.toHaveBeenCalled()
        expect(onSendSpy).not.toHaveBeenCalled()
      })
    })

    describe('when there is a message', () => {
      beforeAll(() => {
        mockMessage = 'yolo'
      })

      it('sends message', () => {
        expect(sendMsgSpy).toHaveBeenCalledWith('yolo')
        expect(onSendSpy).toHaveBeenCalled()
      })
    })
  })
})

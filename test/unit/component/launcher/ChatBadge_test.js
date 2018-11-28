describe('ChatBadge component', () => {
  let ChatBadge,
    ICONS,
    mockLocale = 'en',
    mockIsRTL = false,
    component,
    updateChatScreenSpy = jasmine.createSpy('updateChatScreen'),
    sendMsgSpy = jasmine.createSpy('sendMsg'),
    resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage'),
    onSendSpy = jasmine.createSpy('onSend');

  const chatBadgePath = buildSrcPath('component/launcher/ChatBadge');
  const sharedConstantsPath = buildSrcPath('constants/shared');

  const Icon = class extends Component {
    render() {
      return <div className={this.props.className}>{this.props.type}</div>;
    }
  };

  beforeEach(() => {
    mockery.enable();

    ICONS = requireUncached(sharedConstantsPath).ICONS;
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
      '@zendeskgarden/react-textfields': {
        Input: noopReactComponent()
      },
      'src/redux/modules/base/base-selectors': {
        getZopimChatEmbed: noop
      },
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
        keyCodes: {
          'SPACE': 32,
          'ENTER': 13
        }
      },
      'constants/shared': {
        ICONS
      },
      'src/redux/modules/chat': {
        sendMsg: sendMsgSpy,
        resetCurrentMessage: resetCurrentMessageSpy,
        handleChatBadgeMessageChange: noop,
        updateChatScreen: updateChatScreenSpy
      },
      'src/redux/modules/base': {
        handleChatBadgeMinimize: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: 'PRECHAT_SCREEN',
        CHATTING_SCREEN: 'CHATTING_SCREEN'
      }
    });

    ChatBadge = requireUncached(chatBadgePath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
    sendMsgSpy.calls.reset();
    resetCurrentMessageSpy.calls.reset();
    updateChatScreenSpy.calls.reset();
    onSendSpy.calls.reset();
  });

  describe('renderLabel', () => {
    let result,
      mockBannerSettings = {};

    beforeEach(() => {
      component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />);
      result = component.renderLabel();
    });

    describe('the label prop', () => {
      beforeAll(() => {
        mockBannerSettings.label = 'customText';
      });

      it('renders the label', () => {
        expect(result.props.children)
          .toEqual('customText');
      });
    });

    describe('when layout is image_right', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'image_right';
      });

      it('renders textOnLeft class', () => {
        expect(result.props.className)
          .toContain('textOnLeft');
      });
    });

    describe('when layout is image_left', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'image_left';
      });

      it('renders textOnRight class', () => {
        expect(result.props.className)
          .toContain('textOnRight');
      });
    });

    describe('when layout is text_only', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'text_only';
      });

      it('renders textOnly class', () => {
        expect(result.props.className)
          .toContain('textOnly');
      });
    });
  });

  describe('renderImage', () => {
    let result,
      mockBannerSettings = {};

    beforeEach(() => {
      component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />);
      result = component.renderImage();
    });

    describe('when custom image is present', () => {
      beforeAll(() => {
        mockBannerSettings.image = 'http://img.com/img.png';
      });

      it('renders custom image', () => {
        expect(TestUtils.isElementOfType(result.props.children, 'img'))
          .toEqual(true);
      });

      describe('when layout is image_only', () => {
        beforeAll(() => {
          mockBannerSettings.layout = 'image_only';
        });

        it('renders customImgOnly class', () => {
          expect(result.props.children.props.className)
            .toContain('customImgOnly');
        });
      });

      describe('when layout is not image_only', () => {
        describe('when layout aligns the image to the right', () => {
          beforeAll(() => {
            mockBannerSettings.layout = 'image_right';
          });

          it('renders customImg class', () => {
            expect(result.props.children.props.className)
              .toContain('customImg');
          });

          it('renders the imgRight class', () => {
            expect(result.props.children.props.className)
              .toContain('imgRight');
          });
        });

        describe('when layout aligns the image to the left', () => {
          beforeAll(() => {
            mockBannerSettings.layout = 'image_left';
          });

          it('renders the imgLeft class', () => {
            expect(result.props.children.props.className)
              .toContain('imgLeft');
          });
        });
      });
    });

    describe('when custom image is not present', () => {
      beforeAll(() => {
        mockBannerSettings.image = '';
      });

      it('renders an SVG icon', () => {
        expect(TestUtils.isElementOfType(result.props.children, Icon))
          .toEqual(true);
      });

      it('renders the SVG icon classes', () => {
        expect(result.props.children.props.className)
          .toContain('chatIcon');
      });
    });
  });

  describe('renderContent', () => {
    let result,
      mockBannerSettings = {};

    describe('when layout is image_right', () => {
      beforeEach(() => {
        mockBannerSettings.layout = 'image_right';
        component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />);
        result = component.renderContent();
      });

      it('calls renderLabel then renderImage', () => {
        expect(result[0].key)
          .toEqual('label');
        expect(result[1].key)
          .toEqual('image');
      });
    });

    describe('when layout is image_left', () => {
      beforeEach(() => {
        mockBannerSettings.layout = 'image_left';
        component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />);
        result = component.renderContent();
      });

      it('calls renderImage then renderLabel', () => {
        expect(result[0].key)
          .toEqual('image');
        expect(result[1].key)
          .toEqual('label');
      });
    });

    describe('when layout is text_only', () => {
      beforeEach(() => {
        mockBannerSettings.layout = 'text_only';
        component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />);
        spyOn(component, 'renderLabel');
        spyOn(component, 'renderImage');
        result = component.renderContent();
      });

      it('calls renderLabel only', () => {
        expect(component.renderLabel)
          .toHaveBeenCalled();
        expect(component.renderImage)
          .not
          .toHaveBeenCalled();
      });
    });

    describe('when layout is image_only', () => {
      beforeEach(() => {
        mockBannerSettings.layout = 'image_only';
        component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />);
        spyOn(component, 'renderLabel');
        spyOn(component, 'renderImage');
        result = component.renderContent();
      });

      it('calls renderImage only', () => {
        expect(component.renderLabel)
          .not
          .toHaveBeenCalled();
        expect(component.renderImage)
          .toHaveBeenCalled();
      });
    });
  });

  describe('renderSplashDisplay', () => {
    let result,
      mockBannerSettings = {};

    beforeEach(() => {
      component = instanceRender(<ChatBadge bannerSettings={mockBannerSettings} />);
      result = component.renderSplashDisplay();
    });

    describe('when layout is image_only', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'image_only';
      });

      it('does not render splashPadding display class', () => {
        expect(result.props.className)
          .not
          .toContain('splashPadding');
      });
    });

    describe('when layout is image_right', () => {
      beforeAll(() => {
        mockBannerSettings.layout = 'image_right';
      });

      it('renders splashPadding display class', () => {
        expect(result.props.className)
          .toContain('splashPadding');
      });
    });
  });

  describe('sendChatMsg', () => {
    let mockMessage,
      mockEvent = {
        preventDefault: () => {}
      },
      mockPrechatFormRequired;

    beforeEach(() => {
      component = instanceRender(<ChatBadge
        currentMessage={mockMessage}
        updateChatScreen={updateChatScreenSpy}
        sendMsg={sendMsgSpy}
        resetCurrentMessage={resetCurrentMessageSpy}
        onSend={onSendSpy}
        prechatFormRequired={mockPrechatFormRequired}
      />);
      component.sendChatMsg(mockEvent);
    });

    describe('when there is no message', () => {
      beforeAll(() => {
        mockMessage = '';
      });

      it('does not send message', () => {
        expect(sendMsgSpy)
          .not
          .toHaveBeenCalled();
        expect(updateChatScreenSpy)
          .not
          .toHaveBeenCalled();
        expect(resetCurrentMessageSpy)
          .not
          .toHaveBeenCalled();
        expect(onSendSpy)
          .not
          .toHaveBeenCalled();
      });
    });

    describe('when there is a message', () => {
      beforeAll(() => {
        mockMessage = 'yolo';
      });

      describe('when nextScreen is PRECHAT_SCREEN', () => {
        beforeAll(() => {
          mockPrechatFormRequired = true;
        });

        it('updates to PRECHAT_SCREEN', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith('PRECHAT_SCREEN');
        });

        it('does not send message', () => {
          expect(sendMsgSpy)
            .not
            .toHaveBeenCalled();
          expect(resetCurrentMessageSpy)
            .not
            .toHaveBeenCalled();
        });
      });

      describe('when nextScreen is CHATTING_SCREEN', () => {
        beforeAll(() => {
          mockPrechatFormRequired = false;
        });

        it('updates to CHATTING_SCREEN', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith('CHATTING_SCREEN');
        });

        it('sends message', () => {
          expect(sendMsgSpy)
            .toHaveBeenCalledWith('yolo');
          expect(resetCurrentMessageSpy)
            .toHaveBeenCalled();
        });
      });
    });
  });

  describe('handleKeyDown', () => {
    let mockEvent = {
      preventDefault: () => {}
    };

    beforeEach(() => {
      component = instanceRender(<ChatBadge />);
      spyOn(component, 'sendChatMsg');
      component.handleKeyDown(mockEvent);
    });

    describe('when key pressed was ENTER', () => {
      beforeAll(() => {
        mockEvent.keyCode = 13;
      });

      describe('when shift was not pressed', () => {
        beforeAll(() => {
          mockEvent.shiftKey = false;
        });

        it('sends chat message', () => {
          expect(component.sendChatMsg)
            .toHaveBeenCalledWith(mockEvent);
        });
      });

      describe('when shift was pressed', () => {
        beforeAll(() => {
          mockEvent.shiftKey = true;
        });

        afterEach(() => {
          mockEvent.shiftKey = false;
        });

        it('does not send chat message', () => {
          expect(component.sendChatMsg)
            .not
            .toHaveBeenCalled();
        });
      });
    });

    describe('when key pressed was not ENTER', () => {
      beforeAll(() => {
        mockEvent.keyCode = 32;
      });

      it('does not send chat message', () => {
        expect(component.sendChatMsg)
          .not
          .toHaveBeenCalled();
      });
    });
  });
});

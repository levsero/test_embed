const prechatScreen = 'widget/chat/PRECHAT_SCREEN';
const chattingScreen = 'widget/chat/CHATTING_SCREEN';
const loadingScreen = 'widget/chat/LOADING_SCREEN';
const offlineMessageScreen = 'widget/chat/OFFLINE_MESSAGE_SCREEN';

describe('PrechatScreen component', () => {
  let PrechatScreen,
    prechatFormSettingsProp;

  const chatPath = buildSrcPath('component/chat/prechat/PrechatScreen');
  const chatConstantsPath = buildSrcPath('constants/chat');

  const updateChatScreenSpy = jasmine.createSpy('updateChatScreen');
  const resetCurrentMessageSpy = jasmine.createSpy('resetCurrentMessage');

  const ChatOfflineMessageForm = noopReactComponent('ChatOfflineMessageForm');
  const PrechatForm = noopReactComponent('PrechatForm');
  const LoadingSpinner = noopReactComponent('LoadingSpinner');
  const ZendeskLogo = noopReactComponent('ZendeskLogo');

  const DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES;

  beforeEach(() => {
    mockery.enable();

    prechatFormSettingsProp = { form: {}, required: false };

    initMockRegistry({
      './PrechatScreen.scss': {
        locals: {
          scrollContainerMobile: 'scrollContainerMobileClasses',
          mobileContainer: 'mobileContainerClasses',
          logoFooter: 'logoFooterClasses',
          scrollContainer: 'scrollContainerClasses',
          scrollContainerContent: 'scrollContainerContentClasses',
          zendeskLogo: 'zendeskLogoClasses'
        }
      },
      'component/loading/LoadingSpinner': {
        LoadingSpinner
      },
      'component/ZendeskLogo': {
        ZendeskLogo
      },
      'component/chat/prechat/PrechatForm': {
        PrechatForm
      },
      'component/container/Container': {
        Container: noopReactComponent()
      },
      'component/container/ScrollContainer': {
        ScrollContainer: scrollContainerComponent()
      },
      'src/redux/modules/chat': {
        sendMsg: noop,
        handleChatBoxChange: noop,
        setVisitorInfo: noop,
        updateChatScreen: updateChatScreenSpy,
        resetCurrentMessage: resetCurrentMessageSpy
      },
      'src/redux/modules/chat/chat-selectors': {
        getPrechatFormFields: noop
      },
      'src/redux/modules/chat/chat-screen-types': {
        PRECHAT_SCREEN: prechatScreen,
        CHATTING_SCREEN: chattingScreen,
        LOADING_SCREEN: loadingScreen,
        OFFLINE_MESSAGE_SCREEN: offlineMessageScreen
      },
      'service/i18n': {
        i18n: {
          t: _.identity,
          isRTL: () => {}
        }
      },
      'constants/chat': {
        AGENT_BOT: 'agent:trigger',
        DEPARTMENT_STATUSES
      },
      'component/chat/ChatOfflineMessageForm': {
        ChatOfflineMessageForm
      }
    });

    mockery.registerAllowable(chatPath);
    PrechatScreen = requireUncached(chatPath).default.WrappedComponent;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();

    updateChatScreenSpy.calls.reset();
  });

  describe('onPrechatFormComplete', () => {
    let component,
      setVisitorInfoSpy,
      sendMsgSpy,
      setDepartmentSpy,
      formInfo,
      sendOfflineMessageSpy,
      clearDepartmentSpy,
      mockDepartments;

    beforeEach(() => {
      setVisitorInfoSpy = jasmine.createSpy('setVisitorInfo');
      sendMsgSpy = jasmine.createSpy('sendMsg');
      setDepartmentSpy = jasmine.createSpy('setDepartment');
      sendOfflineMessageSpy = jasmine.createSpy('sendOfflineMessage');
      clearDepartmentSpy = jasmine.createSpy('clearDepartment');
      component = instanceRender(
        <PrechatScreen
          postChatFormSettings={{ header: 'foo' }}
          prechatFormSettings={prechatFormSettingsProp}
          setVisitorInfo={setVisitorInfoSpy}
          sendMsg={sendMsgSpy}
          setDepartment={setDepartmentSpy}
          updateChatScreen={updateChatScreenSpy}
          resetCurrentMessage={resetCurrentMessageSpy}
          departments={mockDepartments}
          sendOfflineMessage={sendOfflineMessageSpy}
          clearDepartment={clearDepartmentSpy} />
      );

      component.onPrechatFormComplete(formInfo);
    });

    afterEach(() => {
      setVisitorInfoSpy.calls.reset();
      sendMsgSpy.calls.reset();
      setDepartmentSpy.calls.reset();
      updateChatScreenSpy.calls.reset();
      sendOfflineMessageSpy.calls.reset();
    });

    describe('when display_name is not specified in the form data', () => {
      const nameValue = 'test name';

      beforeAll(() => {
        formInfo = {
          name: nameValue,
          email: 'mother@of.dragons',
          phone: '87654321',
          message: 'bend the knee',
          department: 12345
        };

        mockDepartments = {
          12345: {
            status: 'online'
          }
        };
      });

      it('uses the value of the name as the display_name', () => {
        expect(setVisitorInfoSpy.calls.mostRecent().args[0].display_name)
          .toEqual(nameValue);
      });
    });

    describe('when the form data has null or undefined values', () => {
      beforeAll(() => {
        formInfo = {
          display_name: 'name',
          email: undefined,
          phone: null
        };
      });

      it('omits those values from the setVisitorInfo call', () => {
        const visitorInfo = _.omit(formInfo, ['email', 'phone']);

        expect(setVisitorInfoSpy)
          .toHaveBeenCalledWith(visitorInfo);
      });
    });

    describe('when department is specified', () => {
      describe('when department is online', () => {
        beforeAll(() => {
          formInfo = {
            display_name: 'Daenerys Targaryen',
            email: 'mother@of.dragons',
            phone: '87654321',
            message: 'bend the knee',
            department: 12345
          };

          mockDepartments = {
            12345: {
              status: 'online'
            }
          };
        });

        it('calls setDepartment with correct arguments', () => {
          expect(setDepartmentSpy)
            .toHaveBeenCalledWith(formInfo.department, jasmine.any(Function), jasmine.any(Function));
        });

        it('calls setVisitorInfo with the correct arguments', () => {
          expect(setVisitorInfoSpy)
            .toHaveBeenCalledWith({
              display_name: 'Daenerys Targaryen',
              email: 'mother@of.dragons',
              phone: '87654321'
            });
        });

        it('calls updateChatScreen with the CHATTING_SCREEN', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(chattingScreen);
        });

        describe('when there is a message to send', () => {
          beforeAll(() => {
            formInfo.message = 'Bend the knee m8.';
          });

          it('sends an online message', () => {
            setDepartmentSpy.calls.mostRecent().args[1]();
            expect(sendMsgSpy)
              .toHaveBeenCalledWith('Bend the knee m8.');
          });
        });

        describe('when there is no message to send', () => {
          beforeAll(() => {
            formInfo.message = null;
          });

          it('does not send online message', () => {
            setDepartmentSpy.calls.mostRecent().args[1]();
            expect(sendMsgSpy)
              .not
              .toHaveBeenCalled();
          });
        });
      });

      describe('when department is offline', () => {
        beforeAll(() => {
          formInfo = {
            display_name: 'Daenerys Targaryen',
            email: 'mother@of.dragons',
            phone: '87654321',
            message: 'bend the knee',
            department: 12345
          };

          mockDepartments = {
            12345: {
              status: 'offline'
            }
          };
        });

        it('calls updateChatScreen with LOADING_SCREEN', () => {
          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(loadingScreen);
        });

        it('calls sendOfflineMessage with formInfo', () => {
          expect(sendOfflineMessageSpy)
            .toHaveBeenCalledWith(formInfo, jasmine.any(Function), jasmine.any(Function));
        });

        it('calls updateChatScreen with offline screen when the callbackSuccess is invoked', () => {
          const callbackSuccess = sendOfflineMessageSpy.calls.mostRecent().args[1];

          callbackSuccess();

          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(offlineMessageScreen);
        });

        it('calls updateChatScreen with preChat screen when the callbackFailure is invoked', () => {
          const callbackFailure = sendOfflineMessageSpy.calls.mostRecent().args[2];

          callbackFailure();

          expect(updateChatScreenSpy)
            .toHaveBeenCalledWith(prechatScreen);
        });
      });
    });

    describe('when department is not specified', () => {
      beforeAll(() => {
        formInfo = {
          display_name: 'Daenerys Targaryen',
          email: 'mother@of.dragons',
          phone: '87654321'
        };

        mockDepartments = null;
      });

      it('calls clearDepartment with the correct arguments', () => {
        expect(clearDepartmentSpy)
          .toHaveBeenCalledWith(jasmine.any(Function));
      });

      it('should call setVisitorInfo with the correct arguments', () => {
        expect(setVisitorInfoSpy)
          .toHaveBeenCalledWith({
            display_name: 'Daenerys Targaryen',
            email: 'mother@of.dragons',
            phone: '87654321'
          });
      });

      it('calls updateChatScreen with the CHATTING_SCREEN', () => {
        expect(updateChatScreenSpy)
          .toHaveBeenCalledWith(chattingScreen);
      });

      describe('when there is a message to send', () => {
        beforeAll(() => {
          formInfo.message = 'Bend the knee m8.';
        });

        it('sends an online message', () => {
          clearDepartmentSpy.calls.mostRecent().args[0]();
          expect(sendMsgSpy)
            .toHaveBeenCalledWith('Bend the knee m8.');
        });
      });

      describe('when there is no message to send', () => {
        beforeAll(() => {
          formInfo.message = null;
        });

        it('does not send online message', () => {
          clearDepartmentSpy.calls.mostRecent().args[0]();
          expect(sendMsgSpy)
            .not
            .toHaveBeenCalled();
        });
      });
    });

    it('calls resetCurrentMessage', () => {
      expect(resetCurrentMessageSpy)
        .toHaveBeenCalled();
    });
  });

  describe('render', () => {
    let component,
      result;

    describe('when state.screen is `prechat`', () => {
      beforeEach(() => {
        component = instanceRender(
          <PrechatScreen
            screen={prechatScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
        result = component.render();
      });

      describe('the scroll container wrapper', () => {
        it('has its classes prop to the scroll container style', () => {
          expect(result.props.classes)
            .toEqual('scrollContainerClasses');
        });

        it('has its containerClasses prop to the scrollContainerContent style', () => {
          expect(result.props.containerClasses)
            .toEqual('scrollContainerContentClasses');
        });

        it('renders the PrechatForm component', () => {
          expect(TestUtils.isElementOfType(result.props.children, PrechatForm))
            .toEqual(true);
        });
      });
    });

    describe('when state.screen is `offlinemessage`', () => {
      beforeEach(() => {
        component = instanceRender(
          <PrechatScreen
            screen={offlineMessageScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
        result = component.render();
      });

      describe('the scroll container wrapper', () => {
        it('has its classes prop to the scroll container style', () => {
          expect(result.props.classes)
            .toEqual('scrollContainerClasses');
        });

        it('has its containerClasses prop to the scrollContainerContent style', () => {
          expect(result.props.containerClasses)
            .toEqual('scrollContainerContentClasses');
        });

        it('renders the ChatOfflineMessageForm component', () => {
          expect(TestUtils.isElementOfType(result.props.children, ChatOfflineMessageForm))
            .toEqual(true);
        });
      });
    });

    describe('when state.screen is `loading`', () => {
      beforeEach(() => {
        component = instanceRender(
          <PrechatScreen
            screen={loadingScreen}
            prechatFormSettings={prechatFormSettingsProp} />
        );
        result = component.render();
      });

      describe('the scroll container wrapper', () => {
        it('has its classes prop to the scroll container style', () => {
          expect(result.props.classes)
            .toEqual('scrollContainerClasses');
        });

        it('has its containerClasses prop to the scrollContainerContent style', () => {
          expect(result.props.containerClasses)
            .toEqual('scrollContainerContentClasses');
        });

        it('renders the LoadingSpinner component', () => {
          expect(TestUtils.isElementOfType(result.props.children, LoadingSpinner))
            .toEqual(true);
        });
      });
    });

    describe('scroll container classes', () => {
      describe('when user is on mobile', () => {
        beforeEach(() => {
          component = instanceRender(
            <PrechatScreen
              screen={prechatScreen}
              prechatFormSettings={prechatFormSettingsProp}
              isMobile={true} />
          );
          result = component.render();
        });

        it('render mobileContainer class on scroll container', () => {
          expect(result.props.classes)
            .toContain('mobileContainerClasses');
        });
      });

      describe('when user is not on mobile', () => {
        beforeEach(() => {
          component = instanceRender(
            <PrechatScreen
              screen={prechatScreen}
              prechatFormSettings={prechatFormSettingsProp}
              isMobile={false} />
          );
          result = component.render();
        });

        it('does not render mobileContainer class on scroll container', () => {
          expect(result.props.classes)
            .not
            .toContain('mobileContainerClasses');
        });
      });

      describe('when hideZendeskLogo is false', () => {
        beforeEach(() => {
          component = instanceRender(
            <PrechatScreen
              screen={prechatScreen}
              prechatFormSettings={prechatFormSettingsProp}
              hideZendeskLogo={false} />
          );
          result = component.render();
        });

        it('renders logo in footer', () => {
          expect(TestUtils.isElementOfType(result.props.footerContent, ZendeskLogo))
            .toBeTruthy();
        });

        it('renders footer with correct class', () => {
          expect(result.props.footerClasses)
            .toContain('logoFooterClasses');
        });
      });

      describe('when hideZendeskLogo is true', () => {
        beforeEach(() => {
          component = instanceRender(
            <PrechatScreen
              screen={prechatScreen}
              prechatFormSettings={prechatFormSettingsProp}
              hideZendeskLogo={true} />
          );
          result = component.render();
        });

        it('does not render logo in footer', () => {
          expect(result.props.footerContent)
            .toBeFalsy();
        });

        it('renders footer with correct class', () => {
          expect(result.props.footerClasses)
            .not.toContain('logoFooterClasses');
        });
      });
    });
  });
});
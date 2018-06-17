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
      mockScreen;

    beforeEach(() => {
      const prechatFormSettings = { form: {}, message: '' };

      component = instanceRender(<PrechatScreen screen={mockScreen} prechatFormSettings={prechatFormSettings} />);

      spyOn(component, 'renderPreChatForm');
      spyOn(component, 'renderLoadingSpinner');

      component.render();
    });

    describe('when the screen is prechat screen', () => {
      beforeAll(() => {
        mockScreen = prechatScreen;
      });

      it('calls renderPreChatForm', () => {
        expect(component.renderPreChatForm)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen is loading screen', () => {
      beforeAll(() => {
        mockScreen = loadingScreen;
      });

      it('calls renderLoadingSpinner', () => {
        expect(component.renderLoadingSpinner)
          .toHaveBeenCalled();
      });
    });

    describe('when the screen is unrecognised', () => {
      beforeAll(() => {
        mockScreen = 'bob screen';
      });

      it('does not call renderPreChatForm', () => {
        expect(component.renderPreChatForm)
          .not.toHaveBeenCalled();
      });

      it('does not call renderLoadingSpinner', () => {
        expect(component.renderLoadingSpinner)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('renderPreChatForm', () => {
    let result;

    beforeEach(() => {
      const prechatFormSettings = { form: {}, message: '' };
      const component = instanceRender(<PrechatScreen prechatFormSettings={prechatFormSettings} />);

      result = component.renderPreChatForm();
    });

    it('renders renderPreChatForm', () => {
      expect(TestUtils.isElementOfType(result, PrechatForm))
        .toEqual(true);
    });
  });

  describe('renderLoadingSpinner', () => {
    let result,
      mockIsMobile;

    beforeEach(() => {
      const prechatFormSettings = { form: {}, message: '' };
      const component = instanceRender(<PrechatScreen prechatFormSettings={prechatFormSettings} isMobile={mockIsMobile} />);

      result = component.renderLoadingSpinner();
    });

    describe('when it is mobile mode', () => {
      beforeAll(() => {
        mockIsMobile = true;
      });

      it('renders with mobile styles', () => {
        expect(result.props.classes)
          .toContain('mobileContainerClasses');
      });

      it('renders a loading spinner', () => {
        expect(TestUtils.isElementOfType(result.props.children[0], LoadingSpinner))
          .toEqual(true);
      });
    });

    describe('when it is desktop mode', () => {
      beforeAll(() => {
        mockIsMobile = false;
      });

      it('does not render with mobile styles', () => {
        expect(result.props.classes)
          .not.toContain('mobileContainerClasses');
      });

      it('renders a loading spinner', () => {
        expect(TestUtils.isElementOfType(result.props.children[0], LoadingSpinner))
          .toEqual(true);
      });
    });
  });
});

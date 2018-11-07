describe('chatPreview file', () => {
  let mockRegistry,
    mockFrame;
  const previewPath = buildSrcPath('chatPreview');
  const defaultOptions = {
    locale: 'en-US',
    color: '#659700',
    styles: {
      float: 'right',
      width: 342,
      marginTop: '16px',
      marginRight: '16px'
    }
  };
  const updatePreviewerScreenSpy = jasmine.createSpy('updatePreviewerScreen');
  const updatePreviewerSettingsSpy = jasmine.createSpy('updatePreviewerSettings');
  const dispatchSpy = jasmine.createSpy('dispatch');
  const createStoreSpy = jasmine.createSpy().and.callFake(() => ({ dispatch: dispatchSpy }));
  const i18nSpy = jasmine.createSpyObj('i18n', ['init', 'setLocale']);
  const chatForceUpdateSpy = jasmine.createSpy('chat.forceUpdate');

  beforeEach(() => {
    mockery.enable();

    mockFrame = requireUncached(buildTestPath('unit/mocks/mockFrame')).MockFrame;

    class ChatComponent extends Component {
      constructor() {
        super();
        this.chat = { forceUpdate: chatForceUpdateSpy };
      }
      getActiveComponent = () => this.chat
      render() {
        return (
          <div></div>
        );
      }
    }

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/frame/Frame': mockFrame,
      'globalCSS': '',
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return (
              <div style={this.props.style}>
                {this.props.children}
              </div>
            );
          }
        }
      },
      'component/chat/Chat': connectedComponent(<ChatComponent />),
      'service/i18n': {
        i18n: i18nSpy
      },
      'src/polyfills': {},
      'src/redux/modules/chat': {
        updatePreviewerScreen: updatePreviewerScreenSpy,
        updatePreviewerSettings: updatePreviewerSettingsSpy
      },
      'embed/webWidget/webWidgetStyles.js': '',
      'src/redux/modules/chat/chat-screen-types': {
        OFFLINE_MESSAGE_SCREEN: 'OFFLINE_MESSAGE_SCREEN'
      },
      'src/redux/createStore': createStoreSpy,
      'src/redux/modules/chat/chat-action-types': {
        UPDATE_PREVIEWER_SETTINGS: 'UPDATE_PREVIEWER_SETTINGS',
        UPDATE_PREVIEWER_SCREEN: 'UPDATE_PREVIEWER_SCREEN'
      },
      'constants/chat': {
        SDK_ACTION_TYPE_PREFIX: 'websdk'
      },
      'src/constants/shared': {
        MAX_WIDGET_HEIGHT: 550,
        WIDGET_WIDTH: 342,
        WIDGET_MARGIN: 15
      },
      'utility/color/styles': {
        generateUserWidgetCSS: _.identity
      }
    });

    requireUncached(previewPath);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('zEPreview.renderPreview', () => {
    let element;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
    });

    describe('when calling with an element property in options', () => {
      it('should not throw an error', () => {
        expect(() => window.zEPreview.renderPreview({ element }))
          .not.toThrow();
      });

      describe('setting the locale', () => {
        let mockSetLocale;

        beforeEach(() => {
          mockSetLocale = mockRegistry['service/i18n'].i18n.setLocale;
        });

        describe('when a locale option is used', () => {
          it('should call i18n.setLocale with the set value', () => {
            window.zEPreview.renderPreview({ element, locale: 'fr' });

            expect(mockSetLocale)
              .toHaveBeenCalledWith('fr');
          });
        });

        describe('when a locale option is not used', () => {
          it('should call i18n.setLocale with the default value', () => {
            window.zEPreview.renderPreview({ element });

            expect(mockSetLocale)
              .toHaveBeenCalledWith(defaultOptions.locale);
          });
        });
      });

      it('passes the correct props to Frame', () => {
        const preview = window.zEPreview.renderPreview({ element });

        const props = preview._component.props;

        expect(props)
          .toEqual(jasmine.objectContaining({
            name: 'chatPreview',
            disableOffsetHorizontal: true,
            preventClose: true
          }));
      });

      describe('setting the styles', () => {
        let preview,
          expectedStyles;

        describe('when a styles object is passed in', () => {
          const styles = {
            float: 'left',
            marginTop: '32px',
            marginLeft: '32px',
            width: '100px'
          };

          beforeEach(() => {
            expectedStyles = {
              ...styles,
              width: '112px'
            };
            preview = window.zEPreview.renderPreview({ element, styles })._component;
          });

          it('passes updated styles to Frame', () => {
            expect(preview.props.frameStyle)
              .toEqual(jasmine.objectContaining(expectedStyles));
          });

          it('applies the correct custom container styles', () => {
            expect(preview.props.children.props.style.width)
              .toBe('100px');
          });
        });

        describe('when no styles object is passed in', () => {
          beforeEach(() => {
            expectedStyles = {
              ...defaultOptions.styles,
              width: '369px'
            };
            preview = window.zEPreview.renderPreview({ element })._component;
          });

          it('uses default styles', () => {
            expect(preview.props.frameStyle)
              .toEqual(jasmine.objectContaining(expectedStyles));
          });

          it('applies the correct default container styles', () => {
            expect(preview.props.children.props.style.width)
              .toBe('357px');
          });
        });
      });

      it('writes the preview to the parent element', () => {
        window.zEPreview.renderPreview({ element });

        expect(element.querySelector('.rootComponent'))
          .toBeDefined();
      });
    });

    describe('createStore', () => {
      beforeEach(() => {
        window.zEPreview.renderPreview({ element });
      });

      it('is called with the correct params', () => {
        expect(createStoreSpy)
          .toHaveBeenCalledWith('chatpreview', {
            throttleEvents: true,
            allowedActionsFn: jasmine.any(Function)
          });
      });

      describe('allowedActions param', () => {
        let allowedActionsFn;

        beforeEach(() => {
          allowedActionsFn = createStoreSpy.calls.mostRecent().args[1].allowedActionsFn;
        });

        it('does not allow normal events', () => {
          expect(allowedActionsFn('CHAT_MSG_REQUEST_SUCCESS'))
            .toEqual(false);
        });

        it('allows webSDK events', () => {
          expect(allowedActionsFn('websdk/something'))
            .toEqual(true);
        });

        it('allows UPDATE_PREVIEWER_SETTINGS events', () => {
          expect(allowedActionsFn('UPDATE_PREVIEWER_SETTINGS'))
            .toEqual(true);
        });

        it('allows UPDATE_PREVIEWER_SCREEN events', () => {
          expect(allowedActionsFn('UPDATE_PREVIEWER_SCREEN'))
            .toEqual(true);
        });
      });
    });

    describe('when calling with no element property in options', () => {
      it('should throw an error', () => {
        expect(() => window.zEPreview.renderPreview())
          .toThrow();
      });
    });
  });

  describe('setColor', () => {
    let preview, component;

    beforeEach(() => {
      const element = document.body.appendChild(document.createElement('div'));

      preview = window.zEPreview.renderPreview({ element });
      component = preview._component;
    });

    describe('when a color parameter is supplied', () => {
      beforeEach(() => {
        spyOn(component, 'setButtonColor');
        preview.setColor('#FF0000');
      });

      it('should call setButtonColor with that color value', () => {
        expect(component.setButtonColor)
          .toHaveBeenCalledWith('#FF0000');
      });
    });

    describe('when no color parameter is supplied', () => {
      beforeEach(() => {
        spyOn(component, 'setButtonColor');
        preview.setColor();
      });

      it('should call setButtonColor with the default color value', () => {
        expect(component.setButtonColor)
          .toHaveBeenCalledWith(defaultOptions.color);
      });
    });
  });

  describe('updateScreen', () => {
    let element, preview;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
      preview = window.zEPreview.renderPreview({ element });
    });

    describe('when screen is an online screen', () => {
      beforeEach(() => {
        preview.updateScreen('chatting');
      });

      it('calls updatePreviewerScreen action with a payload with status true', () => {
        expect(updatePreviewerScreenSpy)
          .toHaveBeenCalledWith({ screen: 'chatting', status: true });
      });
    });

    describe('when screen is an offline screen', () => {
      beforeEach(() => {
        preview.updateScreen('OFFLINE_MESSAGE_SCREEN');
      });

      it('calls updatePreviewerScreen action with a payload with status false', () => {
        expect(updatePreviewerScreenSpy)
          .toHaveBeenCalledWith({ screen: 'OFFLINE_MESSAGE_SCREEN', status: false });
      });
    });
  });

  describe('updateSettings', () => {
    let element;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
      const preview = window.zEPreview.renderPreview({ element });

      preview.updateSettings({ rating: { enabled: true } });
    });

    it('calls updatePreviewerSettings action with the payload', () => {
      expect(updatePreviewerSettingsSpy)
        .toHaveBeenCalledWith({ rating: { enabled: true } });
    });
  });

  describe('updateChatState', () => {
    let element, action, preview;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
      preview = window.zEPreview.renderPreview({ element });
      preview.updateChatState(action);
    });

    afterEach(() => {
      dispatchSpy.calls.reset();
    });

    describe('when detail does not have a type', () => {
      beforeAll(() => {
        action = { type: 'account_status', detail: 'online' };
      });

      it('calls store.dispatch with the type of the root object', () => {
        expect(dispatchSpy)
          .toHaveBeenCalledWith({ type: 'websdk/account_status', payload: action });
      });
    });

    describe('when detail does have a type', () => {
      beforeAll(() => {
        action = { type: 'chat', detail: { type: 'chat.memberjoin' } };
      });

      it('calls store.dispatch with the type of the detail key', () => {
        expect(dispatchSpy)
          .toHaveBeenCalledWith({ type: 'websdk/chat.memberjoin', payload: action });
      });
    });
  });

  describe('updateLocale', () => {
    let element, preview;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
      preview = window.zEPreview.renderPreview({ element });

      spyOn(preview._component, 'updateFrameLocale');
      preview.updateLocale('de');
    });

    it('calls i18n.setLocale with the locale and forceUpdate as true', () => {
      expect(i18nSpy.setLocale)
        .toHaveBeenCalledWith('de', true);
    });

    it('calls frame.updateFrameLocale', () => {
      expect(preview._component.updateFrameLocale)
        .toHaveBeenCalled();
    });

    it('calls chat.getActiveComponent.forceUpdate', () => {
      expect(updatePreviewerScreenSpy)
        .toHaveBeenCalledWith({ screen: 'chatting', status: true });
    });
  });
});

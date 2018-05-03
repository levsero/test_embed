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

  beforeEach(() => {
    mockery.enable();

    mockFrame = requireUncached(buildTestPath('unit/mocks/mockFrame')).MockFrame;

    const ChatComponent = noopReactComponent();

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/frame/Frame': {
        Frame: mockFrame
      },
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
        i18n: jasmine.createSpyObj('i18n', ['setLocale'])
      },
      'src/redux/modules/chat': {
        updatePreviewerScreen: updatePreviewerScreenSpy,
        updatePreviewerSettings: updatePreviewerSettingsSpy
      },
      'embed/webWidget/webWidgetStyles.js': '',
      'src/redux/createStore': () => ({ dispatch: dispatchSpy })
    });

    requireUncached(previewPath);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('window.zE', () => {
    describe('when window.zE is not already defined', () => {
      it('exposes a new zE global with renderPreview function', () => {
        expect(window.zE)
          .toEqual({ renderPreview: jasmine.any(Function) });
      });
    });

    describe('when window.zE is already defined', () => {
      beforeEach(() => {
        window.zE = { someOtherMethod: () => {} };
        requireUncached(previewPath);
      });

      it('extends it with the renderPreview function', () => {
        expect(window.zE)
          .toEqual({ someOtherMethod: jasmine.any(Function), renderPreview: jasmine.any(Function) });
      });
    });
  });

  describe('zE.renderPreview', () => {
    let element;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
    });

    describe('when calling with an element property in options', () => {
      it('should not throw an error', () => {
        expect(() => window.zE.renderPreview({ element }))
          .not.toThrow();
      });

      describe('setting the locale', () => {
        let mockSetLocale;

        beforeEach(() => {
          mockSetLocale = mockRegistry['service/i18n'].i18n.setLocale;
        });

        describe('when a locale option is used', () => {
          it('should call i18n.setLocale with the set value', () => {
            window.zE.renderPreview({ element, locale: 'fr' });

            expect(mockSetLocale)
              .toHaveBeenCalledWith('fr');
          });
        });

        describe('when a locale option is not used', () => {
          it('should call i18n.setLocale with the default value', () => {
            window.zE.renderPreview({ element });

            expect(mockSetLocale)
              .toHaveBeenCalledWith(defaultOptions.locale);
          });
        });
      });

      it('passes the correct props to Frame', () => {
        const preview = window.zE.renderPreview({ element });

        const props = preview._component.props;

        expect(props)
          .toEqual(jasmine.objectContaining({
            name: 'chatPreview',
            disableOffsetHorizontal: true,
            preventClose: true
          }));
      });

      describe('setting the styles', () => {
        let preview;

        describe('when a styles object is passed in', () => {
          const styles = {
            float: 'left',
            marginTop: '32px',
            marginLeft: '32px',
            width: 1
          };

          beforeEach(() => {
            preview = window.zE.renderPreview({ element, styles })._component;
          });

          it('passes updated styles to Frame', () => {
            expect(preview.props.frameStyle)
              .toEqual(jasmine.objectContaining(styles));
          });

          it('applies the correct custom container styles', () => {
            expect(preview.props.children.props.style.width)
              .toBe(1);
          });
        });

        describe('when no styles object is passed in', () => {
          beforeEach(() => {
            preview = window.zE.renderPreview({ element })._component;
          });

          it('uses default styles', () => {
            expect(preview.props.frameStyle)
              .toEqual(jasmine.objectContaining(defaultOptions.styles));
          });

          it('applies the correct default container styles', () => {
            expect(preview.props.children.props.style.width)
              .toBe(342);
          });
        });
      });

      it('writes the preview to the parent element', () => {
        window.zE.renderPreview({ element });

        expect(element.querySelector('.rootComponent'))
          .toBeDefined();
      });
    });

    describe('when calling with no element property in options', () => {
      it('should throw an error', () => {
        expect(() => window.zE.renderPreview())
          .toThrow();
      });
    });
  });

  describe('updateScreen', () => {
    let element;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
      const preview = window.zE.renderPreview({ element });

      preview.updateScreen('chatting');
    });

    it('calls updatePreviewerScreen action with the payload', () => {
      expect(updatePreviewerScreenSpy)
        .toHaveBeenCalledWith('chatting');
    });
  });

  describe('updateSettings', () => {
    let element;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
      const preview = window.zE.renderPreview({ element });

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
      dispatchSpy.calls.reset();
      element = document.body.appendChild(document.createElement('div'));
      preview = window.zE.renderPreview({ element });
    });

    describe('when detail does not have a type', () => {
      beforeEach(() => {
        action = { type: 'account_status', detail: 'online' };
        preview.updateChatState(action);
      });

      it('calls store.dispatch with the type of the root object', () => {
        expect(dispatchSpy)
          .toHaveBeenCalledWith({ type: 'websdk/account_status', payload: action });
      });
    });

    describe('when detail does have a type', () => {
      beforeEach(() => {
        action = { type: 'chat', detail: { type: 'chat.memberjoin' } };
        preview.updateChatState(action);
      });

      it('calls store.dispatch with the type of the detail key', () => {
        expect(dispatchSpy)
          .toHaveBeenCalledWith({ type: 'websdk/chat.memberjoin', payload: action });
      });
    });
  });
});

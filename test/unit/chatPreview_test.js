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
      'embed/webWidget/webWidgetStyles.js': '',
      'src/redux/createStore': noop
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
});

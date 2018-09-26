describe('webWidgetPreview entry file', () => {
  let mockRegistry,
    mockFrame,
    mockSetFormTitleKey;
  const webWidgetPreviewPath = buildSrcPath('webWidgetPreview');
  const defaultOptions = {
    locale: 'en-US',
    color: '#659700',
    titleKey: 'message',
    styles: {
      float: 'right',
      width: 342,
      marginTop: '16px',
      marginRight: '16px'
    }
  };

  beforeEach(() => {
    mockery.enable();

    mockSetFormTitleKey = jasmine.createSpy('setFormTitleKey');
    mockFrame = requireUncached(buildTestPath('unit/mocks/mockFrame')).MockFrame;

    const MockSubmitTicket = class extends Component {
      constructor() {
        super();
        this.setFormTitleKey = mockSetFormTitleKey;
      }
      render() {
        return <div />;
      }
    };

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'lodash': _,
      'globalCSS': '',
      'component/frame/Frame': mockFrame,
      'component/container/Container': {
        Container: class extends Component {
          render() {
            return (
              <div
                className='rootComponent'
                style={this.props.style}>
                {this.props.children}
              </div>
            );
          }
        }
      },
      'component/submitTicket/SubmitTicket': connectedComponent(<MockSubmitTicket />),
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['setLocale'])
      },
      'utility/devices': {
        isMobileBrowser: noop
      },
      'service/settings': {
        settings: { get: noop }
      },
      'embed/webWidget/webWidget.scss': '',
      'embed/webWidget/webWidgetStyles.js': '',
      'src/redux/createStore': noop,
      'src/constants/shared': {
        MAX_WIDGET_HEIGHT: 550,
        WIDGET_WIDTH: 342,
        WIDGET_MARGIN: 15
      }
    });

    requireUncached(webWidgetPreviewPath);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('window.zE', () => {
    describe('when window.zE is not already defined', () => {
      it('exposes a new zE global with renderWebWidgetPreview function', () => {
        expect(window.zE)
          .toEqual({ renderWebWidgetPreview: jasmine.any(Function) });
      });
    });

    describe('when window.zE is already defined', () => {
      beforeEach(() => {
        window.zE = () => {};
        requireUncached(webWidgetPreviewPath);
      });

      it('extends it with the renderWebWidgetPreview function', () => {
        expect(window.zE.renderWebWidgetPreview)
          .toEqual(jasmine.any(Function));
      });
    });
  });

  describe('zE.renderWebWidgetPreview', () => {
    let element;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
    });

    describe('when calling with an element property in options', () => {
      it('should not throw an error', () => {
        expect(() => window.zE.renderWebWidgetPreview({ element }))
          .not.toThrow();
      });

      describe('setting the locale', () => {
        let mockSetLocale;

        beforeEach(() => {
          mockSetLocale = mockRegistry['service/i18n'].i18n.setLocale;
        });

        describe('when a locale option is used', () => {
          it('should call i18n.setLocale with the set value', () => {
            window.zE.renderWebWidgetPreview({
              element,
              locale: 'fr'
            });

            expect(mockSetLocale)
              .toHaveBeenCalledWith('fr');
          });
        });

        describe('when a locale option is not used', () => {
          it('should call i18n.setLocale with the default value', () => {
            window.zE.renderWebWidgetPreview({ element });

            expect(mockSetLocale)
              .toHaveBeenCalledWith(defaultOptions.locale);
          });
        });
      });

      it('passes the correct props to Frame', () => {
        const preview = window.zE.renderWebWidgetPreview({ element });

        const props = preview._component.props;

        expect(props)
          .toEqual(jasmine.objectContaining({
            name: 'webWidgetPreview',
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
            preview = window.zE.renderWebWidgetPreview({ element, styles })._component;
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
            preview = window.zE.renderWebWidgetPreview({ element })._component;
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

      it('should return an object with setColor and setTitle methods', () => {
        const preview = window.zE.renderWebWidgetPreview({ element });

        expect(preview)
          .toEqual(jasmine.any(Object));

        expect(preview.setColor)
          .toEqual(jasmine.any(Function));

        expect(preview.setTitle)
          .toEqual(jasmine.any(Function));
      });

      it('writes the preview to the parent element', () => {
        window.zE.renderWebWidgetPreview({ element });

        expect(element.querySelector('.rootComponent'))
          .toBeDefined();
      });
    });

    describe('when calling with no element property in options', () => {
      it('should throw an error', () => {
        expect(() => window.zE.renderWebWidgetPreview())
          .toThrow();
      });
    });

    describe('setColor', () => {
      let preview, component;

      beforeEach(() => {
        preview = window.zE.renderWebWidgetPreview({ element });
        component = preview._component;
      });

      describe('when a color parameter is supplied', () => {
        it('should call setButtonColor with that color value', () => {
          spyOn(component, 'setButtonColor');
          preview.setColor('#FF0000');

          expect(component.setButtonColor)
            .toHaveBeenCalledWith('#FF0000');
        });
      });

      describe('when no color parameter is supplied', () => {
        it('should call setButtonColor with the default color value', () => {
          spyOn(component, 'setButtonColor');
          preview.setColor();

          expect(component.setButtonColor)
            .toHaveBeenCalledWith(defaultOptions.color);
        });
      });
    });

    describe('setTitle', () => {
      let preview;

      beforeEach(() => {
        preview = window.zE.renderWebWidgetPreview({ element });
      });

      describe('when a titleKey parameter is supplied', () => {
        it('calls setFormTitleKey with that titleKey value', () => {
          preview.setTitle('contact');

          expect(mockSetFormTitleKey)
            .toHaveBeenCalledWith('contact');
        });
      });

      describe('when no titleKey parameter is supplied', () => {
        it('calls setFormTitleKey with the default titleKey value', () => {
          preview.setTitle();

          expect(mockSetFormTitleKey)
            .toHaveBeenCalledWith(defaultOptions.titleKey);
        });
      });
    });
  });
});

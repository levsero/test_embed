describe('webWidgetPreview entry file', () => {
  let mockRegistry,
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
    resetDOM();
    mockery.enable();

    mockSetFormTitleKey = jasmine.createSpy('setFormTitleKey');

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'lodash': _,
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mocks/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mocks/mockFrameFactory')).mockFrameMethods
      },
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
      'component/submitTicket/SubmitTicket': {
        SubmitTicket: class extends Component {
          constructor() {
            super();
            this.setFormTitleKey = mockSetFormTitleKey;
          }
          render() {
            return <div />;
          }
        }
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['setLocale'])
      },
      'embed/webWidget/webWidget.scss': '',
      'embed/webWidget/webWidgetStyles.js': '',
      'src/redux/createStore': noop
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
    let element,
      mockFrameFactory;

    beforeEach(() => {
      element = document.body.appendChild(document.createElement('div'));
      mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
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

      it('should call frameFactory with correct frameParams', () => {
        window.zE.renderWebWidgetPreview({ element });

        const args = mockFrameFactory.calls.mostRecent().args[1];

        expect(args)
          .toEqual(jasmine.objectContaining({
            name: 'webWidgetPreview',
            disableOffsetHorizontal: true,
            preventClose: true
          }));
      });

      describe('setting the styles', () => {
        describe('when a styles object is passed in', () => {
          const styles = {
            float: 'left',
            marginTop: '32px',
            marginLeft: '32px',
            width: 1
          };

          beforeEach(() => {
            window.zE.renderWebWidgetPreview({ element, styles });
          });

          it('calls frameFactory with custom styles', () => {
            const args = mockFrameFactory.calls.mostRecent().args[1];

            expect(args.frameStyle)
              .toEqual(jasmine.objectContaining(styles));
          });

          it('applies the correct custom container styles', () => {
            expect(element.querySelector('.rootComponent').style.cssText)
              .toContain('width: 1px');
          });
        });

        describe('when no styles object is passed in', () => {
          beforeEach(() => {
            window.zE.renderWebWidgetPreview({ element });
          });

          it('calls frameFactory with default styles', () => {
            const args = mockFrameFactory.calls.mostRecent().args[1];

            expect(args.frameStyle)
              .toEqual(jasmine.objectContaining(defaultOptions.styles));
          });

          it('applies the correct default container styles', () => {
            expect(element.querySelector('.rootComponent').style.cssText)
              .toContain('width: 342px');
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
      let mockSetButtonColor,
        preview;

      beforeEach(() => {
        preview = window.zE.renderWebWidgetPreview({ element });
        mockSetButtonColor = mockRegistry['embed/frameFactory'].frameMethods.setButtonColor;
      });

      describe('when a color parameter is supplied', () => {
        it('should call setButtonColor with that color value', () => {
          preview.setColor('#FF0000');

          expect(mockSetButtonColor)
            .toHaveBeenCalledWith('#FF0000');
        });
      });

      describe('when no color parameter is supplied', () => {
        it('should call setButtonColor with the default color value', () => {
          preview.setColor();

          expect(mockSetButtonColor)
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

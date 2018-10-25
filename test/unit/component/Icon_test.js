describe('Icon components', function() {
  let Icon,
    IconButton,
    mockRTLValue,
    ICONS,
    mockIsMobile = false;

  const iconPath = buildSrcPath('component/Icon');
  const sharedConstantsPath = buildSrcPath('constants/shared');
  const ENTER_KEYCODE = 13;

  class DummyIcon {
    render() {
      return (<svg><g id="Layer_Test"><path d="M" /></g></svg>);
    }
  }

  beforeEach(() => {
    mockery.enable();

    mockRTLValue = false;
    ICONS = requireUncached(sharedConstantsPath).ICONS;

    initMockRegistry({
      'React': React,
      'icons/widget-icon_avatar.svg': DummyIcon,
      'icons/widget-icon_back.svg': DummyIcon,
      'icons/widget-icon_channelChoice-contactForm.svg': DummyIcon,
      'icons/widget-icon_channelChoice-talk.svg': DummyIcon,
      'icons/widget-icon_chat.svg': DummyIcon,
      'icons/widget-icon_circle_tick.svg': DummyIcon,
      'icons/widget-icon_clearInput.svg': DummyIcon,
      'icons/widget-icon_close.svg': DummyIcon,
      'icons/widget-icon_concierge.svg': DummyIcon,
      'icons/widget-icon_dash.svg': DummyIcon,
      'icons/widget-icon_ellipsis.svg': DummyIcon,
      'icons/widget-icon_endChat.svg': DummyIcon,
      'icons/widget-icon_help.svg': DummyIcon,
      'icons/widget-icon_launcher-talk.svg': DummyIcon,
      'icons/widget-icon_menu.svg': DummyIcon,
      'icons/widget-icon_reopened.svg': DummyIcon,
      'icons/widget-icon_search.svg': DummyIcon,
      'icons/widget-icon_sendChat.svg': DummyIcon,
      'icons/widget-icon_sound_off.svg': DummyIcon,
      'icons/widget-icon_sound_on.svg': DummyIcon,
      'icons/widget-icon_tick.svg': DummyIcon,
      'icons/widget-icon_zendesk.svg': DummyIcon,
      'icons/widget-icon_facebook.svg': DummyIcon,
      'icons/widget-icon_arrow-down-stroke.svg': DummyIcon,
      'icons/widget-icon_google-plus.svg': DummyIcon,
      'icons/widget-icon_new-channelChoice-contactForm.svg': DummyIcon,
      'icons/widget-icon_channelChoice-chat.svg': DummyIcon,
      'icons/widget-icon_new-channelChoice-talk.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/12/check-sm-stroke.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/14/attachment.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/14/checkmark-fill.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/16/chevron-left-fill.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/16/chevron-right-fill.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/14/error-fill.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/14/error.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/16/image-stroke.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/14/link-external.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/14/remove.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/16/trash-fill.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/16/thumbs-down-stroke.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/16/thumbs-up-stroke.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/26/file-document.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/26/file-error.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/26/file-image.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/26/file-pdf.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/26/file-presentation.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/26/file-spreadsheet.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/26/file-zip.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/26/file.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/14/previous.svg': DummyIcon,
      'icons/widget-icon_success_contactForm.svg': DummyIcon,
      'icons/widget-icon_success_talk.svg': DummyIcon,
      'icons/widget-icon_talk.svg': DummyIcon,
      '@zendeskgarden/svg-icons/src/16/x-stroke.svg': DummyIcon,
      'utility/devices': {
        isMobileBrowser: function() {
          return mockIsMobile;
        }
      },
      'utility/keyboard': {
        keyCodes: {
          ENTER: ENTER_KEYCODE
        }
      },
      'service/i18n': {
        i18n: {
          isRTL: () => mockRTLValue
        }
      },
      'constants/shared': {
        ICONS
      },
      './Icon.scss': {
        locals: {
          mobile: 'is-mobile',
          button: 'button',
          altText: 'altText',
          tooltip: 'tooltip',
          tooltipShown: 'tooltipShown',
          flipX: 'flipX'
        }
      }
    });

    mockery.registerAllowable(iconPath);

    Icon = requireUncached(iconPath).Icon;
    IconButton = requireUncached(iconPath).IconButton;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('Icon', () => {
    it('should not have mobile classes when isMobileBrowser is false', function() {
      const icon = domRender(<Icon type="Icon--zendesk" />);

      expect(icon.props.className)
        .not.toMatch('is-mobile');
    });

    it('should not have flipX classes when flipX is false', function() {
      const icon = domRender(<Icon type="Icon--zendesk" />);

      expect(icon.props.className)
        .not.toMatch('flipX');
    });

    describe('when mobile is true', () => {
      let result;

      beforeEach(() => {
        mockIsMobile = true;

        result = domRender(<Icon type="Icon--zendesk" isMobile={mockIsMobile} />).render();
      });

      it('should have mobile classes', () => {
        expect(result.props.className)
          .toMatch('is-mobile');
      });
    });

    describe('when flipX is true', () => {
      let result;

      beforeEach(() => {
        result = domRender(<Icon type="Icon--zendesk" flipX={true} />).render();
      });

      it('should have flipX classes', () => {
        expect(result.props.className)
          .toMatch('flipX');
      });
    });
  });

  describe('IconButton', () => {
    describe('#render', () => {
      let component,
        wrapperEl,
        buttonEl;

      beforeEach(() => {
        component = instanceRender(<IconButton type='Icon--zendesk' altText='Clickable Icon' />);
        wrapperEl = component.render();
        buttonEl = wrapperEl.props.children[0];
      });

      describe('child elements', () => {
        describe('Icon', () => {
          it('renders an Icon element of the correct type', () => {
            expect(buttonEl.props.children[0].props.type)
              .toMatch('Icon--zendesk');
          });
        });

        describe('alt text', () => {
          it('renders an element for the alt text', () => {
            expect(buttonEl.props.children[1].type)
              .toMatch('span');
          });

          it('renders the alt text for the icon', () => {
            expect(buttonEl.props.children[1].props.children)
              .toMatch('Clickable Icon');
          });
        });

        describe('tooltip element', () => {
          let buttonDisabled = false,
            tooltipDisabled = false;

          it('renders an element for the tooltip', () => {
            expect(wrapperEl.props.children[1].props.className)
              .toContain('tooltip');
          });

          describe('when the button is hovered over', () => {
            beforeEach(() => {
              component = domRender(
                <IconButton
                  type='Icon--zendesk'
                  altText='Clickable Icon'
                  disabled={buttonDisabled}
                  disableTooltip={tooltipDisabled} />
              );
              component.handleMouseOver();
            });

            describe('when the button and tooltips are both enabled', () => {
              it('has the `tooltipShown` class', () => {
                expect(ReactDOM.findDOMNode(component).querySelector('.tooltipShown'))
                  .toBeTruthy();
              });
            });

            describe('when the button is disabled', () => {
              beforeAll(() => {
                buttonDisabled = true;
              });

              it('does not have the `tooltipShown` class', () => {
                expect(ReactDOM.findDOMNode(component).querySelector('.tooltipShown'))
                  .toBeNull();
              });
            });

            describe('when the tooltip is disabled', () => {
              beforeAll(() => {
                tooltipDisabled = true;
              });

              it('does not have the `tooltipShown` class', () => {
                expect(ReactDOM.findDOMNode(component).querySelector('.tooltipShown'))
                  .toBeNull();
              });
            });
          });
        });
      });
    });

    describe('handleKeyDown', () => {
      let component, keyCode, stopPropagationSpy, onClickSpy;

      beforeEach(() => {
        onClickSpy = jasmine.createSpy('onClick');
        stopPropagationSpy = jasmine.createSpy('stopPropagation');

        component = instanceRender(<IconButton onClick={onClickSpy} />);

        const mockEvent = {
          keyCode: keyCode,
          stopPropagation: stopPropagationSpy
        };

        component.handleKeyDown(mockEvent);
      });

      it('calls stopPropagation on the event', () => {
        expect(stopPropagationSpy)
          .toHaveBeenCalled();
      });

      describe('when keyCode is the enter key', () => {
        beforeAll(() => {
          keyCode = ENTER_KEYCODE;
        });

        it('calls props.onClick', () => {
          expect(onClickSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when keyCode is not the enter key', () => {
        beforeAll(() => {
          keyCode = 0;
        });

        it('does not call props.onClick', () => {
          expect(onClickSpy)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});

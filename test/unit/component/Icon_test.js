describe('Icon component', function() {
  let Icon,
    ICONS;

  const iconPath = buildSrcPath('component/Icon');
  const sharedConstantsPath = buildSrcPath('constants/shared');

  class DummyIcon {
    render() {
      return (<svg><g id="Layer_Test"><path d="M" /></g></svg>);
    }
  }

  beforeEach(function() {
    mockery.enable();

    ICONS = requireUncached(sharedConstantsPath).ICONS;

    initMockRegistry({
      'React': React,
      'icons/widget-icon_avatar.svg': DummyIcon,
      'icons/widget-icon_back.svg': DummyIcon,
      'icons/widget-icon_channelChoice-contactForm.svg': DummyIcon,
      'icons/widget-icon_channelChoice-talk.svg': DummyIcon,
      'icons/widget-icon_chat.svg': DummyIcon,
      'icons/widget-icon_checkboxCheck.svg': DummyIcon,
      'icons/widget-icon_circle_tick.svg': DummyIcon,
      'icons/widget-icon_clearInput.svg': DummyIcon,
      'icons/widget-icon_close.svg': DummyIcon,
      'icons/widget-icon_dash.svg': DummyIcon,
      'icons/widget-icon_concierge.svg': DummyIcon,
      'icons/widget-icon_ellipsis.svg': DummyIcon,
      'icons/widget-icon_endChat.svg': DummyIcon,
      'icons/widget-icon_help.svg': DummyIcon,
      'icons/widget-icon_launcher-talk.svg': DummyIcon,
      'icons/widget-icon_link.svg': DummyIcon,
      'icons/widget-icon_reopened.svg': DummyIcon,
      'icons/widget-icon_search.svg': DummyIcon,
      'icons/widget-icon_thumb-down.svg': DummyIcon,
      'icons/widget-icon_thumb-up.svg': DummyIcon,
      'icons/widget-icon_tick.svg': DummyIcon,
      'icons/widget-icon_zendesk.svg': DummyIcon,
      'zd-svg-icons/src/14-attachment.svg': DummyIcon,
      'zd-svg-icons/src/14-error.svg': DummyIcon,
      'zd-svg-icons/src/26-file.svg': DummyIcon,
      'zd-svg-icons/src/26-file-pdf.svg': DummyIcon,
      'zd-svg-icons/src/26-file-presentation.svg': DummyIcon,
      'zd-svg-icons/src/26-file-spreadsheet.svg': DummyIcon,
      'zd-svg-icons/src/26-file-document.svg': DummyIcon,
      'zd-svg-icons/src/26-file-image.svg': DummyIcon,
      'zd-svg-icons/src/26-file-zip.svg': DummyIcon,
      'zd-svg-icons/src/26-file-error.svg': DummyIcon,
      'zd-svg-icons/src/14-chevron.svg': DummyIcon,
      'icons/widget-icon_sound_on.svg': DummyIcon,
      'icons/widget-icon_sound_off.svg': DummyIcon,
      'zd-svg-icons/src/14-link-external.svg': DummyIcon,
      'zd-svg-icons/src/14-checkmark-fill.svg': DummyIcon,
      'zd-svg-icons/src/14-error-fill.svg': DummyIcon,
      'zd-svg-icons/src/14-remove.svg': DummyIcon,
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'constants/shared': {
        ICONS
      },
      './Icon.scss': {
        locals: {
          mobile: 'is-mobile'
        }
      }
    });

    mockery.registerAllowable(iconPath);

    Icon = requireUncached(iconPath).Icon;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have mobile classes when isMobileBrowser is false', function() {
    const icon = shallowRender(<Icon type="Icon--zendesk" />);

    expect(icon.props.className)
      .not.toMatch('is-mobile');
  });

  it('should have mobile classes when isMobileBrowser is true', function() {
    mockery.registerMock('utility/devices', {
      isMobileBrowser: function isMobileBrowser() {
        return true;
      }
    });

    Icon = requireUncached(iconPath).Icon;

    const icon = shallowRender(<Icon type="Icon--zendesk" />);

    expect(icon.props.className)
      .toMatch('is-mobile');
  });
});

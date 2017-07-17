describe('Icon component', function() {
  let Icon;
  const iconPath = buildSrcPath('component/Icon');

  class DummyIcon {
    render() {
      return (<svg><g id="Layer_Test"><path d="M" /></g></svg>);
    }
  }

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'icons/widget-icon_concierge.svg': DummyIcon,
      'icons/widget-icon_back.svg': DummyIcon,
      'icons/widget-icon_channelChoice-chat.svg': DummyIcon,
      'icons/widget-icon_channelChoice-contactForm.svg': DummyIcon,
      'icons/widget-icon_chat.svg': DummyIcon,
      'icons/widget-icon_checkboxCheck.svg': DummyIcon,
      'icons/widget-icon_circle_tick_large.svg': DummyIcon,
      'icons/widget-icon_circle_tick_small.svg': DummyIcon,
      'icons/widget-icon_clearInput.svg': DummyIcon,
      'icons/widget-icon_close.svg': DummyIcon,
      'icons/widget-icon_help.svg': DummyIcon,
      'icons/widget-icon_link.svg': DummyIcon,
      'icons/widget-icon_search.svg': DummyIcon,
      'icons/widget-icon_thumb-down.svg': DummyIcon,
      'icons/widget-icon_thumb-up.svg': DummyIcon,
      'icons/widget-icon_tick.svg': DummyIcon,
      'icons/widget-icon_zendesk.svg': DummyIcon,
      'zd-svg-icons/src/14-attachment.svg': DummyIcon,
      'zd-svg-icons/src/26-file.svg': DummyIcon,
      'zd-svg-icons/src/26-file-pdf.svg': DummyIcon,
      'zd-svg-icons/src/26-file-presentation.svg': DummyIcon,
      'zd-svg-icons/src/26-file-spreadsheet.svg': DummyIcon,
      'zd-svg-icons/src/26-file-document.svg': DummyIcon,
      'zd-svg-icons/src/26-file-image.svg': DummyIcon,
      'zd-svg-icons/src/26-file-zip.svg': DummyIcon,
      'zd-svg-icons/src/26-file-error.svg': DummyIcon,
      'zd-svg-icons/src/14-chevron.svg': DummyIcon,
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
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

  it('should insert an SVG icon inside a span, with the right class', function() {
    const icon = shallowRender(<Icon type="Icon--zendesk" />);

    expect(icon.props.className)
      .toMatch('Icon Icon--zendesk');
  });

  it('should not have mobile classes when isMobileBrowser is false', function() {
    const icon = shallowRender(<Icon type="Icon--zendesk" />);

    expect(icon.props.className)
      .toMatch('Icon Icon--zendesk');

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
      .toMatch('Icon Icon--zendesk');

    expect(icon.props.className)
      .toMatch('is-mobile');
  });
});

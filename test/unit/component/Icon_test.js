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
      'icons/widget-icon_link.svg': DummyIcon,
      'icons/widget-icon_back.svg': DummyIcon,
      'icons/widget-icon_close.svg': DummyIcon,
      'icons/widget-icon_chat.svg': DummyIcon,
      'icons/widget-icon_help.svg': DummyIcon,
      'icons/widget-icon_search.svg': DummyIcon,
      'icons/widget-icon_zendesk.svg': DummyIcon,
      'icons/widget-icon_icon.svg': DummyIcon,
      'icons/widget-icon_form.svg': DummyIcon,
      'icons/widget-icon_tick.svg': DummyIcon,
      'icons/widget-icon_circle_tick_large.svg': DummyIcon,
      'icons/widget-icon_circle_tick_small.svg': DummyIcon,
      'icons/widget-icon_checkboxCheck.svg': DummyIcon,
      'icons/widget-icon_caret.svg': DummyIcon,
      'icons/widget-icon_avatar.svg': DummyIcon,
      'icons/widget-icon_article.svg': DummyIcon,
      'icons/widget-icon_clearInput.svg': DummyIcon,
      'icons/widget-icon_paperclip_small.svg': DummyIcon,
      'icons/widget-icon_paperclip_medium.svg': DummyIcon,
      'icons/widget-icon_paperclip_large.svg': DummyIcon,
      'icons/attach_pdf.svg': DummyIcon,
      'icons/attach_doc.svg': DummyIcon,
      'icons/attach_img.svg': DummyIcon,
      'icons/attach_num.svg': DummyIcon,
      'icons/attach_pag.svg': DummyIcon,
      'icons/attach_ppt.svg': DummyIcon,
      'icons/attach_txt.svg': DummyIcon,
      'icons/attach_key.svg': DummyIcon,
      'icons/attach_xls.svg': DummyIcon,
      'icons/attach_unknown.svg': DummyIcon,
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

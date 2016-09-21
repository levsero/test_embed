describe('Icon component', function() {
  let Icon;
  const iconPath = buildSrcPath('component/Icon');
  const dummyIcon = React.createClass({
    render: function() {
      return (<svg><g id="Layer_Test"><path d="M" /></g></svg>);
    }
  });

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'icons/widget-icon_link.svg': dummyIcon,
      'icons/widget-icon_back.svg': dummyIcon,
      'icons/widget-icon_close.svg': dummyIcon,
      'icons/widget-icon_chat.svg': dummyIcon,
      'icons/widget-icon_help.svg': dummyIcon,
      'icons/widget-icon_search.svg': dummyIcon,
      'icons/widget-icon_zendesk.svg': dummyIcon,
      'icons/widget-icon_icon.svg': dummyIcon,
      'icons/widget-icon_form.svg': dummyIcon,
      'icons/widget-icon_tick.svg': dummyIcon,
      'icons/widget-icon_checkboxCheck.svg': dummyIcon,
      'icons/widget-icon_caret.svg': dummyIcon,
      'icons/widget-icon_avatar.svg': dummyIcon,
      'icons/widget-icon_article.svg': dummyIcon,
      'icons/widget-icon_clearInput.svg': dummyIcon,
      'icons/widget-icon_paperclip_small.svg': dummyIcon,
      'icons/widget-icon_paperclip_medium.svg': dummyIcon,
      'icons/widget-icon_paperclip_large.svg': dummyIcon,
      'icons/attach_pdf.svg': dummyIcon,
      'icons/attach_doc.svg': dummyIcon,
      'icons/attach_img.svg': dummyIcon,
      'icons/attach_num.svg': dummyIcon,
      'icons/attach_pag.svg': dummyIcon,
      'icons/attach_ppt.svg': dummyIcon,
      'icons/attach_txt.svg': dummyIcon,
      'icons/attach_key.svg': dummyIcon,
      'icons/attach_xls.svg': dummyIcon,
      'icons/attach_unknown.svg': dummyIcon,
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

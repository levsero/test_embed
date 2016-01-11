describe('Icon component', function() {
  let Icon;
  const iconPath = buildSrcPath('component/Icon');
  const onClick = jasmine.createSpy('onClick');
  const dummyIcon = React.createClass({
    render: function() {
      return (<svg><g id="Layer_Test"><path d="M" /></g></svg>);
    }
  });

  beforeEach(function() {

    resetDOM();

    mockery.enable();

    initMockRegistry({
      'react/addons': React,
      'icons/widget-icon_link.svg': dummyIcon,
      'icons/widget-icon_back.svg': dummyIcon,
      'icons/widget-icon_close.svg': dummyIcon,
      'icons/widget-icon_chat.svg': dummyIcon,
      'icons/widget-icon_help.svg': dummyIcon,
      'icons/widget-icon_search.svg': dummyIcon,
      'icons/widget-icon_zendesk.svg': dummyIcon,
      'icons/widget-icon_icon.svg': dummyIcon,
      'icons/widget-icon_tick.svg': dummyIcon,
      'icons/widget-icon_checkboxCheck.svg': dummyIcon,
      'icons/widget-icon_caret.svg': dummyIcon,
      'icons/widget-icon_avatar.svg': dummyIcon,
      'icons/widget-icon_clearInput.svg': dummyIcon,
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
    const icon = React.render(
      <Icon type="Icon--zendesk" />,
      global.document.body
    );
    const iconElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(icon, 'Icon');
    const iconClasses = iconElem.props.className;
    const iconOnClick = iconElem.props.onClick;

    expect(iconClasses)
      .toMatch('Icon Icon--zendesk');

    expect(iconOnClick)
      .toMatch('');
  });

  it('should include the onClick when passed, and be called when clicked', function() {
    const icon = React.render(
       <Icon type="Icon--search" onClick={onClick} />,
       global.document.body
    );
    const iconElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(icon, 'Icon');
    const iconClasses = iconElem.props.className;

    expect(iconClasses)
      .toMatch('Icon Icon--search');

    ReactTestUtils.Simulate.click(iconElem);

    expect(onClick)
      .toHaveBeenCalled();
  });

  it('should not have mobile classes when isMobileBrowser is false', function() {
    const icon = React.render(
      <Icon type="Icon--zendesk" />,
      global.document.body
    );
    const iconElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(icon, 'Icon');
    const iconClasses = iconElem.props.className;

    expect(iconClasses)
      .toMatch('Icon Icon--zendesk');

    expect(iconClasses)
      .not.toMatch('is-mobile');
  });

  it('should have mobile classes when isMobileBrowser is true', function() {
    mockery.registerMock('utility/devices', {
      isMobileBrowser: function isMobileBrowser() {
        return true;
      }
    });

    Icon = requireUncached(iconPath).Icon;

    const icon = React.render(
      <Icon type="Icon--zendesk" />,
      global.document.body
    );
    const iconElem = ReactTestUtils
      .findRenderedDOMComponentWithClass(icon, 'Icon');
    const iconClasses = iconElem.props.className;

    expect(iconClasses)
      .toMatch('Icon Icon--zendesk');

    expect(iconClasses)
      .toMatch('is-mobile');
  });

});

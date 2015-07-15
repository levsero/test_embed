describe('SvgIcon component', function() {
  var SvgIcon,
      mockRegistry,
      svgIconPath = buildSrcPath('component/SvgIcon'),
      onClick = jasmine.createSpy('onClick'),
      dummySvgIcon = React.createClass({
            render: function() {
              return (<svg><g id="Layer_Test"><path d="M"/></g></svg>);
            }
          });

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      '../asset/icons/widget-icon_link.svg': dummySvgIcon,
      '../asset/icons/widget-icon_back.svg': dummySvgIcon,
      '../asset/icons/widget-icon_close.svg': dummySvgIcon,
      '../asset/icons/widget-icon_chat.svg': dummySvgIcon,
      '../asset/icons/widget-icon_help.svg': dummySvgIcon,
      '../asset/icons/widget-icon_search.svg': dummySvgIcon,
      '../asset/icons/widget-icon_zendesk.svg': dummySvgIcon,
      '../asset/icons/widget-icon_icon.svg': dummySvgIcon,
    });

    mockery.registerAllowable(svgIconPath);

    SvgIcon = require(svgIconPath).SVGIcon;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should insert an SVG icon inside a span, with the right class', function() {
    var icon = React.render(
          <SvgIcon type="Icon--zendesk" />,
          global.document.body
        ),
        iconElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(icon, 'Icon'),
        iconClasses = iconElem.props.className,
        iconOnClick = iconElem.props.onClick;

    expect(iconClasses)
      .toMatch('Icon Icon--zendesk');

    expect(iconOnClick)
      .toMatch('');
  });

  it('should include the onClick when passed, and be called when clicked', function() {
    var icon = React.render(
          <SvgIcon type="Icon--search" onClick={onClick} />,
          global.document.body
        ),
        iconElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(icon, 'Icon'),
        iconClasses = iconElem.props.className;

    expect(iconClasses)
      .toMatch('Icon Icon--search');

    ReactTestUtils.Simulate.click(iconElem);

    expect(onClick)
      .toHaveBeenCalled();

  });

});

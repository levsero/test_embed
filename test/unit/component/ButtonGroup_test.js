describe('ButtonGroup component', function() {
  var ButtonGroup,
      mockRegistry,
      buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React
    });

    mockery.registerAllowable(buttonPath);

    ButtonGroup = require(buttonPath).ButtonGroup;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have rtl classes when rtl prop is false', function() {
    var button = React.render(
          <ButtonGroup />,
          global.document.body
        ),
        buttonElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(button, 'u-textRight'),
        buttonGroupClasses = buttonElem.props.className;

    expect(buttonGroupClasses)
      .toMatch('u-textRight');

    expect(buttonGroupClasses)
      .not.toMatch('u-textLeft');
  });

  it('should have rtl classes when rtl prop is true', function() {
    var button = React.render(
          <ButtonGroup rtl={true} />,
          global.document.body
        ),
        buttonElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(button, 'u-textLeft'),
        buttonGroupClasses = buttonElem.props.className;

    expect(buttonGroupClasses)
      .toMatch('u-textLeft');

    expect(buttonGroupClasses)
      .not.toMatch('u-textRight');
  });

});


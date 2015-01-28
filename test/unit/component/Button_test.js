/** @jsx React.DOM */

describe('Button component', function() {
  var Button,
      mockRegistry,
      buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
    });

    mockery.registerAllowable(buttonPath);

    Button = require(buttonPath).Button;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have fullscreen classes when isMobileBrowser is false', function() {
    var button = React.renderComponent(
          <Button />,
          global.document.body
        ),
        buttonElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(button, 'Button--cta'),
        buttonClasses = buttonElem.props.className;

    expect(buttonClasses.indexOf('u-pullRight') >= 0)
      .toEqual(true);

    expect(buttonClasses.indexOf('u-sizeFull'))
      .toEqual(-1);
  });

  it('should have fullscreen classes when isMobileBrowser is true', function() {
    var button = React.renderComponent(
          <Button fullscreen={true} />,
          global.document.body
        ),
        buttonElem = ReactTestUtils
          .findRenderedDOMComponentWithClass(button, 'Button--cta'),
        buttonClasses = buttonElem.props.className;


    expect(buttonClasses.indexOf('u-sizeFull') >= 0)
      .toEqual(true);

    expect(buttonClasses.indexOf('u-pullRight'))
      .toEqual(-1);
  });

});


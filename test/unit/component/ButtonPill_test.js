describe('ButtonPill component', function() {
  var ButtonPill,
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

    ButtonPill = require(buttonPath).ButtonPill;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('ButtonPill', function() {
    it('should not have is-mobile class when fullscreen is false', function() {
      var button = React.render(
            <ButtonPill
              fullscreen={false} />,
            global.document.body
          ),
          buttonElem = ReactTestUtils
            .findRenderedDOMComponentWithClass(button, 'c-btn--pill'),
          buttonClasses = buttonElem.props.className;

      expect(buttonClasses).not.toMatch('is-mobile');
    });

    it('should have is-mobile class when fullscreen is true', function() {
      var button = React.render(
            <ButtonPill
              fullscreen={true} />,
            global.document.body
          ),
          buttonElem = ReactTestUtils
            .findRenderedDOMComponentWithClass(button, 'c-btn--pill'),
          buttonClasses = buttonElem.props.className;

      expect(buttonClasses).toMatch('is-mobile');
    });
  });

});

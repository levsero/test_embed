describe('ButtonPill component', function() {
  let ButtonPill,
      mockRegistry;
  const buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'component/Loading': {
        LoadingEllipses: noopReactComponent()
      },
      'utility/utils': {
        'generateConstrastColor': noop
      },
      'service/i18n': {
        i18n: {
          isRTL: noop
        }
      }
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
      const button = React.render(
        <ButtonPill fullscreen={false} />,
        global.document.body
      );
      const buttonElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(button, 'c-btn--pill');
      const buttonClasses = buttonElem.props.className;

      expect(buttonClasses).not.toMatch('is-mobile');
    });

    it('should have is-mobile class when fullscreen is true', function() {
      const button = React.render(
        <ButtonPill fullscreen={true} />,
        global.document.body
      );
      const buttonElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(button, 'c-btn--pill');
      const buttonClasses = buttonElem.props.className;

      expect(buttonClasses).toMatch('is-mobile');
    });
  });

});

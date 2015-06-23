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
      'react/addons': React,
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
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
    it('should not have is-Mobile class when isMobileBrowser is false', function() {
      var button = React.render(
            <ButtonPill />,
            global.document.body
          ),
          buttonElem = ReactTestUtils
            .findRenderedDOMComponentWithClass(button, 'c-btn--pill'),
          buttonClasses = buttonElem.props.className;


      expect(buttonClasses)
        .not.toMatch('is-mobile');

      console.log(buttonClasses);
    });

    it('should have is-Mobile class when isMobileBrowser is true', function() {
      mockery.resetCache();
      mockery.registerMock('utility/devices', {
        isMobileBrowser: function() {
          return true;
        }
      });

      ButtonPill = require(buttonPath).ButtonPill;

      var button = React.render(
            <ButtonPill />,
            global.document.body
          ),
          buttonElem = ReactTestUtils
            .findRenderedDOMComponentWithClass(button, 'c-btn--pill'),
          buttonClasses = buttonElem.props.className;


      expect(buttonClasses)
        .toMatch('is-mobile');
    });
  });

});


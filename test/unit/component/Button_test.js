describe('component/Button', function() {
  let Button,
      ButtonSecondary,
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
      'component/Loading': noopReactComponent(),
      'service/i18n': noop
    });

    mockery.registerAllowable(buttonPath);

    Button = require(buttonPath).Button;
    ButtonSecondary = require(buttonPath).ButtonSecondary;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('Button', function() {
    it('should not have fullscreen classes when fullscreen prop is false', function() {
      const button = React.render(
        <Button />,
        global.document.body
      );
      const buttonElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(button, 'c-btn');
      const buttonClasses = buttonElem.props.className;

      expect(buttonClasses)
        .not.toMatch('u-sizeFull');
    });

    it('should have fullscreen classes when fullscreen prop is true', function() {
      const button = React.render(
        <Button fullscreen={true} />,
        global.document.body
      );
      const buttonElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(button, 'c-btn');
      const buttonClasses = buttonElem.props.className;

      expect(buttonClasses)
        .toMatch('u-sizeFull');
    });

    it('should apply className prop to the underlying element', function() {
      const button = React.render(
        <Button className='testClass classTest' />,
        global.document.body
      );

      const buttonElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(button, 'c-btn');
      const buttonClasses = buttonElem.props.className;

      expect(buttonClasses)
        .toMatch('testClass');

      expect(buttonClasses)
        .toMatch('classTest');
    });

    it('should apply style prop to the underlying element', function() {
      const button = React.render(
        <Button style={{ testStyle: 'success' }} />,
        global.document.body
      );

      const buttonElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(button, 'c-btn');
      const buttonStyle = buttonElem.props.style;

      expect(buttonStyle.testStyle)
        .toEqual('success');
    });
  });

  describe('ButtonSecondary', function() {
    it('should apply className prop to the underlying element', function() {
      const button = React.render(
        <ButtonSecondary className='testClass classTest' />,
        global.document.body
      );

      const buttonElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(button, 'c-btn');
      const buttonClasses = buttonElem.props.className;

      expect(buttonClasses)
        .toMatch('testClass');

      expect(buttonClasses)
        .toMatch('classTest');
    });

    it('should apply style prop to the underlying element', function() {
      const button = React.render(
        <ButtonSecondary style={{ testStyle: 'success' }} />,
        global.document.body
      );

      const buttonElem = ReactTestUtils
        .findRenderedDOMComponentWithClass(button, 'c-btn');
      const buttonStyle = buttonElem.props.style;

      expect(buttonStyle.testStyle)
        .toEqual('success');
    });
  });
});

describe('component/Button', function() {
  let Button,
    ButtonSecondary;
  const buttonPath = buildSrcPath('component/Button');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'component/Loading': {
        LoadingEllipses: noopReactComponent()
      },
      'utility/utils': {
        'generateConstrastColor': noop
      },
      'service/i18n': noop
    });

    mockery.registerAllowable(buttonPath);

    Button = requireUncached(buttonPath).Button;
    ButtonSecondary = requireUncached(buttonPath).ButtonSecondary;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('Button', function() {
    it('should not have fullscreen classes when fullscreen prop is false', function() {
      const button = shallowRender(<Button />);

      expect(button.props.className)
        .not.toMatch('u-sizeFull');
    });

    it('should have fullscreen classes when fullscreen prop is true', function() {
      const button = shallowRender(<Button fullscreen={true} />);

      expect(button.props.className)
        .toMatch('u-sizeFull');
    });

    it('should apply className prop to the underlying element', function() {
      const button = shallowRender(<Button className='testClass classTest' />);

      expect(button.props.className)
        .toMatch('testClass');

      expect(button.props.className)
        .toMatch('classTest');
    });

    it('should apply style prop to the underlying element', function() {
      const button = shallowRender(<Button style={{ testStyle: 'success' }} />);

      expect(button.props.style.testStyle)
        .toEqual('success');
    });
  });

  describe('ButtonSecondary', function() {
    it('should apply className prop to the underlying element', function() {
      const button = shallowRender(<ButtonSecondary className='testClass classTest' />);

      expect(button.props.className)
        .toMatch('testClass');

      expect(button.props.className)
        .toMatch('classTest');
    });

    it('should apply style prop to the underlying element', function() {
      const button = shallowRender(<ButtonSecondary style={{ testStyle: 'success' }} />);

      expect(button.props.style.testStyle)
        .toEqual('success');
    });

    it('should render with onClick handler if disabled is false', () => {
      const onClickMock = jasmine.createSpy();

      domRender(<ButtonSecondary disabled={false} onClick={onClickMock} />);

      TestUtils.Simulate.click(document.querySelector('.c-btn--secondary'));

      expect(onClickMock)
        .toHaveBeenCalled();
    });

    it('should not render with onClick handler if disabled is true', () => {
      const onClickMock = jasmine.createSpy();

      domRender(<ButtonSecondary disabled={true} onClick={onClickMock} />);

      TestUtils.Simulate.click(document.querySelector('.c-btn--secondary'));

      expect(onClickMock)
        .not.toHaveBeenCalled();
    });
  });
});

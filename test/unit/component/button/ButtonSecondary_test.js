describe('ButtonSecondary', () => {
  let ButtonSecondary;
  const buttonSecondaryPath = buildSrcPath('component/button/ButtonSecondary');

  beforeEach(() => {
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

    mockery.registerAllowable(buttonSecondaryPath);

    ButtonSecondary = requireUncached(buttonSecondaryPath).ButtonSecondary;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should apply className prop to the underlying element', () => {
    const button = shallowRender(<ButtonSecondary className='testClass classTest' />);

    expect(button.props.className)
      .toMatch('testClass');

    expect(button.props.className)
      .toMatch('classTest');
  });

  it('should apply style prop to the underlying element', () => {
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

describe('Button', function() {
  let Button;
  const buttonPath = buildSrcPath('component/button/Button');

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
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

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

describe('Button', () => {
  let Button;
  const buttonPath = buildSrcPath('component/button/Button');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React
    });

    mockery.registerAllowable(buttonPath);

    Button = requireUncached(buttonPath).Button;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have fullscreen classes when fullscreen prop is false', () => {
    const button = shallowRender(<Button />);

    expect(button.props.className)
      .not.toMatch('u-sizeFull');
  });

  it('should have fullscreen classes when fullscreen prop is true', () => {
    const button = shallowRender(<Button fullscreen={true} />);

    expect(button.props.className)
      .toMatch('u-sizeFull');
  });

  it('should apply className prop to the underlying element', () => {
    const button = shallowRender(<Button className='testClass classTest' />);

    expect(button.props.className)
      .toMatch('testClass');

    expect(button.props.className)
      .toMatch('classTest');
  });

  it('should apply style prop to the underlying element', () => {
    const button = shallowRender(<Button style={{ testStyle: 'success' }} />);

    expect(button.props.style.testStyle)
      .toEqual('success');
  });
});

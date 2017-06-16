describe('Button', () => {
  let Button;
  const buttonPath = buildSrcPath('component/button/Button');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      './Button.sass': {
        locals: {
          mobile: 'mobileClasses',
          filled: 'filledClasses',
          outlined: 'outlinedClasses'
        }
      }
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
      .not.toMatch('mobileClasses');
  });

  it('should have fullscreen classes when fullscreen prop is true', () => {
    const button = shallowRender(<Button fullscreen={true} />);

    expect(button.props.className)
      .toMatch('mobileClasses');
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

  describe('onTouchStartDisabled prop', () => {
    let button;

    describe('when the onTouchStartDisabled prop is not defined', () => {
      beforeEach(() => {
        button = shallowRender(<Button />);
      });

      it('the onTouchStart prop is assigned to the onClick function', () => {
        expect(button.props.onTouchStart)
          .toBe(button.props.onClick);
      });
    });

    describe('when the onTouchStartDisabled prop is true', () => {
      beforeEach(() => {
        button = shallowRender(<Button onTouchStartDisabled={true} />);
      });

      it('the onTouchStart prop is null', () => {
        expect(button.props.onTouchStart)
          .toBe(null);
      });
    });
  });

  describe('primary prop', () => {
    let button;

    describe('default class names', () => {
      beforeEach(() => {
        button = shallowRender(<Button />);
      });

      it('includes the filled classes', () => {
        expect(button.props.className)
          .toMatch('filledClasses');
      });
    });

    describe('when primary prop is false', () => {
      beforeEach(() => {
        button = shallowRender(<Button primary={false} />);
      });

      it('includes the outlined classes', () => {
        expect(button.props.className)
          .toMatch('outlinedClasses');
      });
    });
  });
});

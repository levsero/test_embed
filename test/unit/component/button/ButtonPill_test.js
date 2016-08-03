describe('ButtonPill component', () => {
  let ButtonPill;
  const buttonPath = buildSrcPath('component/button/ButtonPill');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'service/i18n': {
        i18n: {
          isRTL: noop
        }
      }
    });

    mockery.registerAllowable(buttonPath);

    ButtonPill = requireUncached(buttonPath).ButtonPill;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have is-mobile class when fullscreen is false', () => {
    const button = shallowRender(<ButtonPill />);

    expect(button.props.className)
      .not.toMatch('is-mobile');
  });

  it('should have is-mobile class when fullscreen is true', () => {
    const button = shallowRender(<ButtonPill fullscreen={true} />);

    expect(button.props.className)
      .toMatch('is-mobile');
  });
});

describe('ButtonIcon', () => {
  let ButtonIcon,
    button,
    mockIsIeValue;
  const buttonIconPath = buildSrcPath('component/button/ButtonIcon');

  beforeEach(() => {
    resetDOM();

    mockIsIeValue = false;

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'utility/devices': {
        isIE: () => mockIsIeValue
      }
    });

    mockery.registerAllowable(buttonIconPath);

    ButtonIcon = requireUncached(buttonIconPath).ButtonIcon;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('when isIE is true', () => {
    beforeEach(() => {
      mockIsIeValue = true;
      button = shallowRender(<ButtonIcon />);
    });

    it('should have IE classes', () => {
      expect(button.props.className)
        .not.toContain('u-flex');

      expect(button.props.className)
        .toContain('u-paddingBXL');
    });
  });

  describe('when isIE is false', () => {
    beforeEach(() => {
      mockIsIeValue = false;
      button = shallowRender(<ButtonIcon />);
    });

    it('should not have IE classes', () => {
      expect(button.props.className)
        .toContain('u-flex');

      expect(button.props.className)
        .not.toContain('u-paddingBXL');
    });
  });

  describe('when there is a custom className prop', () => {
    const className = 'someClass';

    beforeEach(() => {
      button = shallowRender(<ButtonIcon className={className} />);
    });

    it('should have custom classes', () => {
      expect(button.props.className)
        .toContain(className);
    });
  });
});

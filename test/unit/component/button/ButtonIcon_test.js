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
      },
      './ButtonIcon.sass': {
        locals: {
          'container--actionable': 'container--actionable',
          'container--ie': 'container--ie'
        }
      }
    });

    mockery.registerAllowable(buttonIconPath);

    ButtonIcon = requireUncached(buttonIconPath).ButtonIcon;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let buttonNode;

    describe('when isIE is true', () => {
      beforeEach(() => {
        mockIsIeValue = true;
        const button = domRender(<ButtonIcon />);

        buttonNode = ReactDOM.findDOMNode(button);
      });

      it('should have IE classes', () => {
        expect(buttonNode.className)
          .toContain('container--ie');
      });
    });

    describe('when isIE is false', () => {
      beforeEach(() => {
        mockIsIeValue = false;
        const button = domRender(<ButtonIcon />);

        buttonNode = ReactDOM.findDOMNode(button);
      });

      it('should not have IE classes', () => {
        expect(buttonNode.className)
          .not.toContain('container--ie');
      });
    });

    describe('when props actionable is true', () => {
      beforeEach(() => {
        const button = domRender(<ButtonIcon actionable={true} />);

        buttonNode = ReactDOM.findDOMNode(button);
      });

      it('should have actionable class', () => {
        expect(buttonNode.className)
          .toContain('container--actionable');
      });
    });

    describe('when props actionable is false', () => {
      beforeEach(() => {
        const button = domRender(<ButtonIcon actionable={false} />);

        buttonNode = ReactDOM.findDOMNode(button);
      });

      it('should not have actionable class', () => {
        expect(buttonNode.className)
          .not.toContain('container--actionable');
      });
    });
  });
});

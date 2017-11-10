describe('ButtonIcon', () => {
  let ButtonIcon,
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
          'containerActionable': 'containerActionable',
          'containerIE': 'containerIE'
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

      it('has IE classes', () => {
        expect(buttonNode.className)
          .toContain('containerIE');
      });
    });

    describe('when isIE is false', () => {
      beforeEach(() => {
        mockIsIeValue = false;
        const button = domRender(<ButtonIcon />);

        buttonNode = ReactDOM.findDOMNode(button);
      });

      it('does not have IE classes', () => {
        expect(buttonNode.className)
          .not.toContain('containerIE');
      });
    });

    describe('when props actionable is true', () => {
      beforeEach(() => {
        const button = domRender(<ButtonIcon actionable={true} />);

        buttonNode = ReactDOM.findDOMNode(button);
      });

      it('has actionable class', () => {
        expect(buttonNode.className)
          .toContain('containerActionable');
      });
    });

    describe('when props actionable is false', () => {
      beforeEach(() => {
        const button = domRender(<ButtonIcon actionable={false} />);

        buttonNode = ReactDOM.findDOMNode(button);
      });

      it('has actionable class', () => {
        expect(buttonNode.className)
          .not.toContain('containerActionable');
      });
    });

    describe('when props.iconClasses are passed in', () => {
      beforeEach(() => {
        const button = domRender(<ButtonIcon iconClasses='iconClasses' />);

        buttonNode = ReactDOM.findDOMNode(button);
      });

      it('adds them to the icon', () => {
        expect(buttonNode.querySelector('.iconClasses'))
          .not.toBeNull();
      });
    });
  });
});

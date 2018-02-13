describe('ButtonNav', () => {
  let ButtonNav;
  const buttonNavPath = buildSrcPath('component/button/ButtonNav');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      './ButtonNav.scss': {
        locals: {
          'button': 'button',
          'buttonNewDesign': 'buttonNewDesign'
        }
      }
    });

    mockery.registerAllowable(buttonNavPath);

    ButtonNav = requireUncached(buttonNavPath).ButtonNav;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('render', () => {
    let componentNode;

    describe('when props.newDesign is true', () => {
      beforeEach(() => {
        const component = domRender(<ButtonNav newDesign={true} />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('has new design classes', () => {
        expect(componentNode.querySelector('.buttonNewDesign'))
          .not.toBeNull();
      });

      it('does not have old classes', () => {
        expect(componentNode.querySelector('.button'))
          .toBeNull();
      });
    });

    describe('when props.newDesign is false', () => {
      beforeEach(() => {
        const component = domRender(<ButtonNav />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('does not have new design classes', () => {
        expect(componentNode.querySelector('.buttonNewDesign'))
          .toBeNull();
      });

      it('has old classes', () => {
        expect(componentNode.querySelector('.button'))
          .not.toBeNull();
      });
    });
  });
});

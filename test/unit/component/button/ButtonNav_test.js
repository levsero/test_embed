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
          'left': 'left',
          'right': 'right'
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

    describe('when position is left', () => {
      beforeEach(() => {
        const component = domRender(<ButtonNav position={'left'} />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('has left classes', () => {
        expect(componentNode.querySelector('.left'))
          .not.toBeNull();
      });

      it('does not have right classes', () => {
        expect(componentNode.querySelector('.right'))
          .toBeNull();
      });
    });

    describe('when position is right', () => {
      beforeEach(() => {
        const component = domRender(<ButtonNav position={'right'} />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('has right classes', () => {
        expect(componentNode.querySelector('.right'))
          .not.toBeNull();
      });

      it('does not have left classes', () => {
        expect(componentNode.querySelector('.left'))
          .toBeNull();
      });
    });
  });
});

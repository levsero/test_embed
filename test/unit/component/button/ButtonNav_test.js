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
          left: 'leftClasses',
          right: 'rightClasses',
          desktop: 'desktopClasses',
          fullscreen: 'mobileClasses'
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
        expect(componentNode.querySelector('.leftClasses'))
          .not.toBeNull();
      });

      it('does not have right classes', () => {
        expect(componentNode.querySelector('.rightClasses'))
          .toBeNull();
      });
    });

    describe('when position is right', () => {
      beforeEach(() => {
        const component = domRender(<ButtonNav position={'right'} />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('has right classes', () => {
        expect(componentNode.querySelector('.rightClasses'))
          .not.toBeNull();
      });

      it('does not have left classes', () => {
        expect(componentNode.querySelector('.leftClasses'))
          .toBeNull();
      });
    });

    describe('when on mobile', () => {
      beforeEach(() => {
        const component = domRender(<ButtonNav fullscreen={true} />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('has mobile classes', () => {
        expect(componentNode.querySelector('.mobileClasses'))
          .not.toBeNull();
      });

      it('does not have desktop classes', () => {
        expect(componentNode.querySelector('.desktopClasses'))
          .toBeNull();
      });
    });

    describe('when on desktop', () => {
      beforeEach(() => {
        const component = domRender(<ButtonNav />);

        componentNode = ReactDOM.findDOMNode(component);
      });

      it('has desktop classes', () => {
        expect(componentNode.querySelector('.desktopClasses'))
          .not.toBeNull();
      });

      it('does not have mobile classes', () => {
        expect(componentNode.querySelector('.mobileClasses'))
          .toBeNull();
      });
    });
  });
});

describe('SlideAppear component', () => {
  let SlideAppear;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'react-transition-group/Transition': {
        Transition: noopReactComponent
      }
    });

    const SlideAppearPath = buildSrcPath('component/transition/SlideAppear');

    mockery.registerAllowable(SlideAppearPath);
    SlideAppear = requireUncached(SlideAppearPath).SlideAppear;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('props', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<SlideAppear onClick={() => 'click'} onExited={() => 'exited'}/>);
    });

    it('uses onExited prop', () => {
      expect(component.props.onExited())
        .toEqual('exited');
    });

    it('uses onClick prop', () => {
      expect(component.props.onClick())
        .toEqual('click');
    });
  });
});

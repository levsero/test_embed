describe('SlideUpAppear component', () => {
  let SlideUpAppear;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'react-transition-group/Transition': {
        Transition: noopReactComponent
      }
    });

    const SlideUpAppearPath = buildSrcPath('component/transition/SlideUpAppear');

    mockery.registerAllowable(SlideUpAppearPath);
    SlideUpAppear = requireUncached(SlideUpAppearPath).SlideUpAppear;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('props', () => {
    let component;

    beforeEach(() => {
      component = instanceRender(<SlideUpAppear onClick={() => 'click'} onExited={() => 'exited'}/>);
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

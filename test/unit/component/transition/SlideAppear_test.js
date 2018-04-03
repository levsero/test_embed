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

  describe('transitioning', () => {
    const getTransitionStyle = (direction, phase) => {
      const component = instanceRender(<SlideAppear startPosHeight='startPos' endPosHeight='endPos' direction={direction} />);

      return component.render().props.children(phase).props.style;
    };

    describe('direction up', () => {
      describe('on entering', () => {
        it('sets bottom to startPosHeight', () => {
          expect(getTransitionStyle('up', 'entering'))
            .toEqual(jasmine.objectContaining({ opacity: 0, bottom: 'startPos' }));
        });
      });

      describe('on entered', () => {
        it('sets bottom to startPosHeight', () => {
          expect(getTransitionStyle('up', 'entered'))
            .toEqual(jasmine.objectContaining({ opacity: 1, bottom: 'endPos' }));
        });
      });

      describe('on exiting', () => {
        it('sets bottom to startPosHeight', () => {
          expect(getTransitionStyle('up', 'exiting'))
            .toEqual(jasmine.objectContaining({ opacity: 0, bottom: 'startPos' }));
        });
      });
    });

    describe('direction down', () => {
      describe('on entering', () => {
        it('sets top to startPosHeight', () => {
          expect(getTransitionStyle('down', 'entering'))
            .toEqual(jasmine.objectContaining({ opacity: 0, top: 'startPos' }));
        });
      });

      describe('on entered', () => {
        it('sets top to startPosHeight', () => {
          expect(getTransitionStyle('down', 'entered'))
            .toEqual(jasmine.objectContaining({ opacity: 1, top: 'endPos' }));
        });
      });

      describe('on exiting', () => {
        it('sets top to startPosHeight', () => {
          expect(getTransitionStyle('down', 'exiting'))
            .toEqual(jasmine.objectContaining({ opacity: 0, top: 'startPos' }));
        });
      });
    });
  });
});

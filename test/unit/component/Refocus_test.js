describe('Refocus component', () => {
  let Refocus;
  const refocusPath = buildSrcPath('component/Refocus');
  const createNodeMock = (nodeName, focusSpy) => ({
    ownerDocument: {
      activeElement: { nodeName }
    },
    focus: focusSpy
  });

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      'src/redux/modules/base/base-selectors': {
        getWidgetShown: noop
      }
    });

    Refocus = requireUncached(refocusPath).Refocus;
  });

  describe('componentDidMount', () => {
    describe('widgetShown is true', () => {
      it('this.container receives focus', () => {
        const focused = jasmine.createSpy('focus');

        testRender(<Refocus widgetShown={true} />, {
          createNodeMock: () => createNodeMock('DIV', focused)
        });

        expect(focused)
          .toHaveBeenCalled();
      });

      it('this.container doesn\'t receive focus if activeElement is an input', () => {
        const focused = jasmine.createSpy('focus');

        testRender(<Refocus widgetShown={true} />, {
          createNodeMock: () => createNodeMock('INPUT', focused)
        });

        expect(focused)
          .not.toHaveBeenCalled();
      });

      it('this.container doesn\'t receive focus if activeElement is an textarea', () => {
        const focused = jasmine.createSpy('focus');

        testRender(<Refocus widgetShown={true} />, {
          createNodeMock: () => createNodeMock('TEXTAREA', focused)
        });

        expect(focused)
          .not.toHaveBeenCalled();
      });
    });

    describe('widgetShown is false', () => {
      it('this.container.focus() is not called', () => {
        const focused = jasmine.createSpy('focus');

        instanceRender(<Refocus />);
        testRender(<Refocus />, {
          createNodeMock: () => createNodeMock('DIV', focused)
        });

        expect(focused)
          .not.toHaveBeenCalled();
      });
    });
  });
});

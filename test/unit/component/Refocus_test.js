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
    let element, focusedSpy, componentObj;

    beforeEach(() => {
      focusedSpy = jasmine.createSpy('focus');
    });

    describe('widgetShown is true', () => {
      beforeEach(() => {
        componentObj = testRender(<Refocus widgetShown={true} />, {
          createNodeMock: () => createNodeMock(element, focusedSpy)
        });
      });

      describe('when activeElement is not an input or textarea', () => {
        beforeAll(() => {
          element = 'DIV';
        });

        it('causes this.container to receive focus', () => {
          expect(focusedSpy)
            .toHaveBeenCalled();
        });
      });

      describe('when activeElement is an input', () => {
        beforeAll(() => {
          element = 'INPUT';
        });

        it('this.container doesn\'t receive focus', () => {
          expect(focusedSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when activeElement is a textarea', () => {
        beforeAll(() => {
          element = 'TEXTAREA';
        });

        it('this.container doesn\'t receive focus', () => {
          expect(focusedSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when this.container is the activeElement', () => {
        beforeAll(() => {
          // on first load it will focus on itself, test the second update
          element = 'DIV';
        });

        beforeEach(() => {
          focusedSpy.calls.reset();
          componentObj.update();
        });

        it('this.container doesn\'t receive focus', () => {
          expect(focusedSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('widgetShown is false', () => {
      beforeEach(() => {
        instanceRender(<Refocus />);
        testRender(<Refocus />, {
          createNodeMock: () => createNodeMock('DIV', focusedSpy)
        });
      });

      it('this.container.focus() is not called', () => {
        expect(focusedSpy)
          .not.toHaveBeenCalled();
      });
    });
  });
});

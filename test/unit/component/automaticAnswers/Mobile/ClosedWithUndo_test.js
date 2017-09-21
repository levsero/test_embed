describe('Mobile/ClosedWithUndo component', () => {
  let ClosedWithUndo, component;

  const ClosedWithUndoPath = buildSrcPath(
    'component/automaticAnswers/Mobile/ClosedWithUndo'
  );

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      React: React,
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'component/Icon': {
        Icon: noopReactComponent()
      }
    });

    ClosedWithUndo = requireUncached(ClosedWithUndoPath).default;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('undo link', () => {
    describe('when rendered', () => {
      let closeFrameAfterDelay = jasmine.createSpy();

      beforeEach(() => {
        component = mount(
          <ClosedWithUndo
            isSubmitting={false}
            handleUndo={noop}
            closeFrameAfterDelay={closeFrameAfterDelay}
          />
        );
      });

      it('the link is enabled', () => {
        const className = component.find('a').props().className;

        expect(className).not.toContain('AutomaticAnswersAnchor--disabled');
      });

      it('closes the frame after a delay', () => {
        expect(closeFrameAfterDelay).toHaveBeenCalled();
      });
    });

    describe('when clicked', () => {
      let handleUndo = jasmine.createSpy();

      beforeEach(() => {
        component = shallow(
          <ClosedWithUndo
            isSubmitting={false}
            handleUndo={handleUndo}
            closeFrameAfterDelay={noop}
          />
        );
        component.find('a').simulate('click');
      });

      it('handleUndo is called', () => {
        expect(handleUndo).toHaveBeenCalled();
      });
    });

    describe('when isSubmitting is true', () => {
      beforeEach(() => {
        component = shallow(
          <ClosedWithUndo
            isSubmitting={true}
            handleUndo={noop}
            closeFrameAfterDelay={noop}
          />
        );
      });

      it('the link is disabled', () => {
        const className = component.find('a').props().className;

        expect(className).toContain('AutomaticAnswersAnchor--disabled');
      });
    });
  });
});

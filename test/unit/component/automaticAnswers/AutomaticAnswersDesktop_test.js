describe('AutomaticAnswersDesktop component', () => {
  let AutomaticAnswersDesktop,
    automaticAnswersProps,
    component;

  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswersDesktop');

  beforeEach(() => {
    automaticAnswersProps = {
      handleSolveTicket: jasmine.createSpy()
    };

    resetDOM();

    mockery.enable();

    AutomaticAnswersDesktop = requireUncached(automaticAnswersPath).AutomaticAnswersDesktop;

    component = instanceRender(
      <AutomaticAnswersDesktop
        {...automaticAnswersProps} />
    );
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleSolveClick', () => {
    const e = { preventDefault: noop };

    beforeEach(() => {
      spyOn(e, 'preventDefault');
      component.handleSolveClick(e);
    });

    it('prevents the default DOM click event', () => {
      expect(e.preventDefault)
        .toHaveBeenCalled();
    });

    it('calls handleSolveTicket', () => {
      expect(component.props.handleSolveTicket)
        .toHaveBeenCalled();
    });
  });
});

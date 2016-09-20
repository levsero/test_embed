describe('AutomaticAnswersDesktop component', () => {
  let AutomaticAnswersDesktop,
    automaticAnswersProps,
    component;

  const automaticAnswersPath = buildSrcPath('component/automaticAnswers/AutomaticAnswersDesktop');

  beforeEach(() => {
    automaticAnswersProps = {
      handleSolveTicket: jasmine.createSpy(),
      ticketNiceId: 8765
    };

    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Container': {
        Container: React.createClass({
          render: () => <div>{this.props.children}</div>
        })
      },
      'component/button/Button': {
        Button: noopReactComponent()
      },
      'component/Icon': {
        Icon: React.createClass({
          render: () => <div className='Avatar' />
        })
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      }
    });

    AutomaticAnswersDesktop = requireUncached(automaticAnswersPath).AutomaticAnswersDesktop;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('handleSolveClick', () => {
    const e = { preventDefault: jasmine.createSpy() };

    beforeEach(() => {
      component = instanceRender(
        <AutomaticAnswersDesktop
          {...automaticAnswersProps} />
      );
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

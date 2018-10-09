describe('base root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/index');

    reducer = requireUncached(reducerPath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    let state;

    beforeEach(() => {
      state = reducer({}, { type: '' });
    });

    const subStateList = [
      'activeEmbed',
      'widgetShown',
      'embeds',
      'backButtonVisible',
      'arturos',
      'queue',
      'embeddableConfig',
      'isAuthenticationPending',
      'hasWidgetShown',
      'onApiListeners',
      'webWidgetVisible',
      'launcherVisible'
    ];

    it('has the expected substates', () => {
      _.keys(state).forEach((subState) => {
        if (!subStateList.includes(subState)) {
          fail(`${subState} sub state is missing`);
        }
      });
    });
  });
});

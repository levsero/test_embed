describe('base root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/base/reducer/index');

    initMockRegistry({
      'utility/devices': {
        isMobileBrowser: () => false
      },
      'src/redux/modules/helpCenter/helpCenter-action-types': {},
      'src/redux/modules/zopimChat/zopimChat-action-types': {},
      'src/redux/modules/submitTicket/submitTicket-action-types': {}
    });

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
      'embeddableConfig',
      'isAuthenticationPending',
      'queue',
      'onApiListeners',
      'hasWidgetShown',
      'webWidgetVisible',
      'launcherVisible',
      'widgetInitialised',
      'hidden',
      'bootupTimeout',
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

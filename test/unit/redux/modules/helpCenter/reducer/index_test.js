describe('helpCenter root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/helpCenter/reducer/index');

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
      'activeArticle',
      'searchLoading',
      'articleClicked',
      'searchFailed',
      'searchTerm',
      'articles',
      'resultsCount',
      'resultsLocale',
      'totalUserSearches',
      'restrictedImages',
      'channelChoiceShown',
      'searchFieldValue',
      'searchFieldFocused',
      'articleDisplayed',
      'contextualSearch',
      'lastSearchTimestamp',
      'manualContextualSuggestions'
    ];

    it('has the expected sub states', () => {
      _.keys(state).forEach((subState) => {
        if (!subStateList.includes(subState)) {
          fail(`${subState} sub state is missing`);
        }
      });
    });
  });
});

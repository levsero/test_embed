describe('chat accountSettings reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/index');

    reducer = requireUncached(reducerPath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    let state;
    const propertyList = [
      'attachments',
      'concierge',
      'prechatForm',
      'postchatForm',
      'rating',
      'theme',
      'chatWindow',
      'banner',
      'branding'
    ];
    const assertPropertySpec = (property) => {
      it(`it has ${property} sub-state`, () => {
        expect(state[property])
          .toBeDefined();
      });
    };

    beforeEach(() => {
      state = reducer({}, { type: '' });
    });

    it('has at least a single sub-state', () => {
      expect(propertyList.length > 0)
        .toBe(true);
    });

    propertyList.forEach((property) => {
      assertPropertySpec(property);
    });
  });
});

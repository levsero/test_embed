describe('persist middleware', () => {
  let persist;
  const storeSetSpy = jasmine.createSpy('store.set');

  beforeEach(() => {
    const persistPath = buildSrcPath('redux/middleware/persist');

    mockery.enable();
    initMockRegistry({
      'service/persistence': {
        store: {
          set: storeSetSpy
        }
      },
      'src/redux/modules/base/base-action-types': {
        UPDATE_ACTIVE_EMBED: 'update_active_embed',
        UPDATE_WIDGET_SHOWN: 'update_widget_shown'
      }
    });

    persist = requireUncached(persistPath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('persist', () => {
    let action;
    const nextSpy = jasmine.createSpy('nextSpy');
    const flatState = {
      chat: {
        chats: {}
      },
      base: {
        activeEmbed: 'chat',
        widgetShown: true,
        somethingElse: 'test'
      }
    };

    describe('next', () => {
      beforeEach(() => {
        action = { type: 'random_type' };
        persist({ getState: () => flatState })(nextSpy)(action);
      });

      it('calls next function', () => {
        expect(nextSpy)
          .toHaveBeenCalledWith({ type: 'random_type' });
      });
    });

    describe('when the action is included in the actionsToStoreOn array', () => {
      const actionsToStoreOn = ['update_widget_shown', 'update_active_embed'];

      actionsToStoreOn.forEach((actionType) => {
        beforeEach(() => {
          action = { type: actionType };

          persist({ getState: () => flatState })(nextSpy)(action);
        });

        it(`calls store.set with the parts of base state we want to store for ${actionType}`, () => {
          const expected = {
            activeEmbed: 'chat',
            widgetShown: true
          };

          expect(storeSetSpy)
            .toHaveBeenCalledWith('store', expected);
        });
      });
    });
  });
});

describe('base reducer embeddable config', () => {
  let reducer,
    actionTypes,
    initialState;

  beforeAll(() => {
    mockery.enable();
    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-embeddable-config');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;

    initialState = reducer(undefined, { type: ''});
    actionTypes = requireUncached(actionTypesPath);
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    it('is set to defaults', () => {
      expect(initialState)
        .toEqual({
          embeds: {
            helpCenterForm: {
              props: {
                contextualHelpEnabled: false,
                signInRequired: false
              }
            },
            zopimChat: {
              props: {
                zopimId: '',
                overrideProxy: ''
              }
            }
          },
          cp4: false,
          position: 'right',
          color: '#659700',
          textColor: undefined
        });
    });
  });

  describe('when UPDATE_EMBEDDABLE_CONFIG action is dispatched', () => {
    let state;

    beforeEach(() => {
      let action = {
        type: actionTypes.UPDATE_EMBEDDABLE_CONFIG,
        payload: {
          embeds: {
            helpCenterForm: {
              props: {
                contextualHelpEnabled: true
              }
            },
            zopimChat: {
              props: {
                zopimId: 'yoloId'
              }
            }
          },
          cp4: true,
          position: 'left',
          color: 'white',
          textColor: 'black'
        }
      };

      state = reducer(initialState, action);
    });

    it('reduces to the correct embeddable config state', () => {
      expect(state)
        .toEqual({
          embeds: {
            helpCenterForm: {
              props: {
                contextualHelpEnabled: true,
                signInRequired: false
              }
            },
            zopimChat: {
              props: {
                zopimId: 'yoloId',
                overrideProxy: ''
              }
            }
          },
          cp4: true,
          color: 'white',
          textColor: 'black',
          position: 'left'
        });
    });
  });
});

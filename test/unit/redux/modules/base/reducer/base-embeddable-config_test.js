describe('base reducer embeddable config', () => {
  let reducer,
    actionTypes,
    initialState,
    UPDATE_PREVIEWER_SETTINGS = 'blah';

  beforeAll(() => {
    mockery.enable();

    initMockRegistry({
      'src/redux/modules/chat/chat-action-types': {
        UPDATE_PREVIEWER_SETTINGS
      }
    });

    const reducerPath = buildSrcPath('redux/modules/base/reducer/base-embeddable-config');
    const actionTypesPath = buildSrcPath('redux/modules/base/base-action-types');

    reducer = requireUncached(reducerPath).default;
    actionTypes = requireUncached(actionTypesPath);

    initialState = reducer(undefined, { type: '' });
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
            ticketSubmissionForm: {
              props: {
                attachmentsEnabled: true
              }
            },
            helpCenterForm: {
              props: {
                contextualHelpEnabled: false,
                signInRequired: false
              }
            },
            zopimChat: {
              props: {
                zopimId: '',
                overrideProxy: '',
                standalone: false
              }
            },
            talk: {
              props: {
                color: '',
                serviceUrl: '',
                nickname: ''
              }
            }
          },
          cp4: false,
          position: 'right',
          color: '#659700',
          textColor: undefined,
          hideZendeskLogo: false
        });
    });
  });

  describe('when UPDATE_PREVIEWER_SETTINGS action is dispatched', () => {
    let state;

    beforeEach(() => {
      let action = {
        type: UPDATE_PREVIEWER_SETTINGS
      };

      state = reducer(initialState, action);
    });

    it('reduces to the correct embeddable config state', () => {
      expect(state.cp4)
        .toEqual(true);
    });
  });

  describe('when UPDATE_EMBEDDABLE_CONFIG action is dispatched', () => {
    let state;

    beforeEach(() => {
      let action = {
        type: actionTypes.UPDATE_EMBEDDABLE_CONFIG,
        payload: {
          ipmAllowed: true,
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
            },
            talk: {
              props: {
                nickname: 'bluey',
                color: '#123123',
                serviceUrl: 'https://example.com'
              }
            }
          },
          cp4: true,
          position: 'left',
          color: 'white',
          textColor: 'black',
          hideZendeskLogo: true
        }
      };

      state = reducer(initialState, action);
    });

    it('reduces to the correct embeddable config state', () => {
      expect(state)
        .toEqual({
          ipmAllowed: true,
          embeds: {
            ticketSubmissionForm: {
              props: {
                attachmentsEnabled: true
              }
            },
            helpCenterForm: {
              props: {
                contextualHelpEnabled: true,
                signInRequired: false
              }
            },
            zopimChat: {
              props: {
                zopimId: 'yoloId',
                overrideProxy: '',
                standalone: false
              }
            },
            talk: {
              props: {
                nickname: 'bluey',
                serviceUrl: 'https://example.com',
                color: '#123123'
              }
            }
          },
          cp4: true,
          color: 'white',
          textColor: 'black',
          position: 'left',
          hideZendeskLogo: true
        });
    });
  });
});

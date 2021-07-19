import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import reducer, {
  fetchIntegrations,
  linkIntegration,
  fetchLinkRequest,
  unlinkIntegration,
  getAllIntegrationsLinkStatus,
} from '../integrations'

const stateFromInitial = (newData = {}) => ({
  entities: {},
  ids: [],
  selectedChannel: '',
  ...newData,
})

testReducer(reducer, [
  {
    extraDesc: 'initial state',
    action: { type: undefined },
    expected: { ...stateFromInitial() },
  },
  {
    extraDesc: 'integrations loaded with no valid integrations',
    action: { type: [fetchIntegrations.fulfilled], payload: [] },
    expected: { ...stateFromInitial() },
  },
  {
    extraDesc: 'integrations loaded with some valid integrations',
    action: {
      type: [fetchIntegrations.fulfilled],
      payload: [{ _id: 123, type: 'messenger', appId: 1, pageId: 'p1' }],
    },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
            pageId: 'p1',
            linked: 'not linked',
            type: 'messenger',
          },
        },
        ids: ['messenger'],
      }),
    },
  },
  {
    extraDesc: 'integrations loaded with all valid integrations',
    action: {
      type: [fetchIntegrations.fulfilled],
      payload: [
        { type: 'messenger', _id: 123, appId: 1, pageId: 'p1' },
        { type: 'whatsapp', _id: 234, appId: 2, pageId: 'p2' },
        { type: 'instagram', _id: 345, appId: 3, pageId: 'p3' },
      ],
    },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: 'p1',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
          whatsapp: {
            _id: 234,
            appId: 2,
            pageId: 'p2',
            linked: 'not linked',
            type: 'whatsapp',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
          instagram: {
            _id: 345,
            appId: 3,
            pageId: 'p3',
            linked: 'not linked',
            type: 'instagram',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
        },
        ids: ['messenger', 'whatsapp', 'instagram'],
      }),
    },
  },
  {
    extraDesc: 'Any other action while empty',
    action: { type: 'any other action' },
    expected: { ...stateFromInitial() },
  },
  {
    extraDesc: 'Any other action with valid integrations',
    initialState: {
      ...stateFromInitial({
        entities: { messenger: { _id: 123, appId: 1, pageId: '123' } },
        ids: ['messenger'],
      }),
    },
    action: { type: 'any other action' },
    expected: {
      ...stateFromInitial({
        entities: { messenger: { _id: 123, appId: 1, pageId: '123' } },
        ids: ['messenger'],
      }),
    },
  },
  {
    extraDesc: 'linkIntegration action is passed for a known integration',
    initialState: {
      ...stateFromInitial({
        entities: {
          messenger: { _id: 123, appId: 1, pageId: '123', linked: 'not linked', type: 'messenger' },
        },
        ids: ['messenger'],
      }),
    },
    action: { type: [linkIntegration.fulfilled], payload: { type: 'messenger' } },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: { _id: 123, appId: 1, pageId: '123', linked: 'linked', type: 'messenger' },
        },
        ids: ['messenger'],
      }),
    },
  },
  {
    extraDesc: 'linkIntegration action is passed for an unknown integration',
    initialState: {
      ...stateFromInitial({
        entities: {
          messenger: { _id: 123, appId: 1, pageId: '123', linked: 'not linked', type: 'messenger' },
        },
        ids: ['messenger'],
      }),
    },
    action: { type: [linkIntegration.fulfilled], payload: { type: 'instagram' } },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: { _id: 123, appId: 1, pageId: '123', linked: 'not linked', type: 'messenger' },
        },
        ids: ['messenger'],
      }),
    },
  },
  {
    extraDesc: 'fetchLinkRequest action is passed for a known integration',
    initialState: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: '123',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
        },
        ids: ['messenger'],
      }),
    },
    action: {
      type: [fetchLinkRequest.fulfilled],
      payload: {
        type: 'messenger',
        integrationId: '60dacd66c491a400d3882068',
        code: 'lr_BX7CYtXUsj6Jd4OSm1-VEEPW',
        url: 'https://m.me/105592115117480?ref=lr_BX7CYtXUsj6Jd4OSm1-VEEPW',
      },
    },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: '123',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: true,
            isFetchingLinkRequest: false,
            linkRequest: {
              integrationId: '60dacd66c491a400d3882068',
              type: 'messenger',
              code: 'lr_BX7CYtXUsj6Jd4OSm1-VEEPW',
              url: 'https://m.me/105592115117480?ref=lr_BX7CYtXUsj6Jd4OSm1-VEEPW',
            },
          },
        },
        ids: ['messenger'],
      }),
    },
  },
  {
    extraDesc: 'fetchLinkRequest action is passed for an unknown integration',
    initialState: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: '123',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
        },
        ids: ['messenger'],
      }),
    },
    action: { type: [fetchLinkRequest.fulfilled], payload: { type: 'instagram' } },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: '123',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
        },
        ids: ['messenger'],
      }),
    },
  },
  {
    extraDesc: 'fetchLinkRequest pending action is dispatched',
    initialState: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: '123',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
        },
        ids: ['messenger'],
        selectedChannel: 'messenger',
      }),
    },
    action: { type: [fetchLinkRequest.pending] },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: '123',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: true,
            linkRequest: {},
          },
        },
        ids: ['messenger'],
        selectedChannel: 'messenger',
      }),
    },
  },
  {
    extraDesc: 'fetchLinkRequest rejected action is dispatched',
    initialState: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: '123',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: false,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
        },
        ids: ['messenger'],
        selectedChannel: 'messenger',
      }),
    },
    action: { type: [fetchLinkRequest.rejected] },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: {
            _id: 123,
            appId: 1,
            pageId: '123',
            linked: 'not linked',
            type: 'messenger',
            errorFetchingLinkRequest: true,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          },
        },
        ids: ['messenger'],
        selectedChannel: 'messenger',
      }),
    },
  },

  {
    extraDesc: 'unlinkIntegration action is passed for a known integration',
    initialState: {
      ...stateFromInitial({
        entities: {
          messenger: { _id: 123, appId: 1, pageId: '123', linked: 'linked', type: 'messenger' },
        },
        ids: ['messenger'],
      }),
    },
    action: { type: [unlinkIntegration.fulfilled], payload: { type: 'messenger' } },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: { _id: 123, appId: 1, pageId: '123', linked: 'not linked', type: 'messenger' },
        },
        ids: ['messenger'],
      }),
    },
  },
  {
    extraDesc: 'unlinkIntegration action is passed for an unknown integration',
    initialState: {
      ...stateFromInitial({
        entities: {
          messenger: { _id: 123, appId: 1, pageId: '123', linked: 'linked', type: 'messenger' },
        },
        ids: ['messenger'],
      }),
    },
    action: { type: [unlinkIntegration.fulfilled], payload: { type: 'instagram' } },
    expected: {
      ...stateFromInitial({
        entities: {
          messenger: { _id: 123, appId: 1, pageId: '123', linked: 'linked', type: 'messenger' },
        },
        ids: ['messenger'],
      }),
    },
  },
])

describe('getAllIntegrationsLinkStatus', () => {
  it('transforms the integration object to a channels object of channel:linked status', () => {
    const result = getAllIntegrationsLinkStatus({
      integrations: {
        entities: {
          messenger: { linked: 'linked', type: 'messenger' },
          instagram: { linked: 'not linked', type: 'instagram' },
          whatsapp: { linked: undefined, type: 'whatsapp' },
        },
        ids: ['messenger', 'instagram', 'whatsapp'],
      },
    })

    expect(result).toMatchInlineSnapshot(`
      Object {
        "instagram": "not linked",
        "messenger": "linked",
        "whatsapp": undefined,
      }
    `)
  })

  it('returns an empty object when there are no known integrations', () => {
    const result = getAllIntegrationsLinkStatus({ integrations: { entities: {}, ids: [] } })

    expect(result).toEqual({})
  })
})

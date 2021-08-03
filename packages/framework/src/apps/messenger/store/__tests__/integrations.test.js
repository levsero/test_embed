import { integrationLinked } from 'src/apps/messenger/features/suncoConversation/store'
import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import reducer, {
  fetchIntegrations,
  fetchLinkRequest,
  unlinkIntegration,
  getAllIntegrationsLinkStatus,
} from '../integrations'

testReducer(reducer, [
  {
    extraDesc: 'initial state',
    action: { type: undefined },
    expected: {
      entities: {},
      ids: [],
    },
  },
  {
    extraDesc: 'integrations loaded with no valid integrations',
    action: { type: [fetchIntegrations.fulfilled], payload: [] },
    expected: {
      entities: {},
      ids: [],
    },
  },
  {
    extraDesc: 'integrations loaded with some valid integrations',
    action: {
      type: [fetchIntegrations.fulfilled],
      payload: [{ _id: 123, type: 'messenger', appId: 1, pageId: 'p1' }],
    },
    expected: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
          pageId: 'p1',
          linked: false,
          type: 'messenger',
        },
      },
      ids: ['messenger'],
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
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: 'p1',
          linked: false,
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
          linked: false,
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
          linked: false,
          type: 'instagram',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
        },
      },
      ids: ['messenger', 'whatsapp', 'instagram'],
    },
  },
  {
    extraDesc: 'Any other action while empty',
    action: { type: 'any other action' },
    expected: {
      entities: {},
      ids: [],
    },
  },
  {
    extraDesc: 'Any other action with valid integrations',
    initialState: {
      entities: { messenger: { _id: 123, appId: 1, pageId: '123' } },
      ids: ['messenger'],
    },
    action: { type: 'any other action' },
    expected: {
      entities: { messenger: { _id: 123, appId: 1, pageId: '123' } },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'fetchLinkRequest action is passed for a known integration',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
        },
      },
      ids: ['messenger'],
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
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
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
    },
  },
  {
    extraDesc: 'fetchLinkRequest action is passed for an unknown integration',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
        },
      },
      ids: ['messenger'],
    },
    action: { type: [fetchLinkRequest.fulfilled], payload: { type: 'instagram' } },
    expected: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
        },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'fetchLinkRequest pending action is dispatched',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
        },
      },
      ids: ['messenger'],
    },
    action: { type: [fetchLinkRequest.pending], meta: { arg: { channelId: 'messenger' } } },
    expected: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: true,
          linkRequest: {},
        },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'fetchLinkRequest rejected action is dispatched',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
        },
      },
      ids: ['messenger'],
    },
    action: { type: [fetchLinkRequest.rejected], meta: { arg: { channelId: 'messenger' } } },
    expected: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          errorFetchingLinkRequest: true,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
        },
      },
      ids: ['messenger'],
    },
  },

  {
    extraDesc: 'unlinkIntegration action is passed for a known integration',
    initialState: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: true, type: 'messenger' },
      },
      ids: ['messenger'],
    },
    action: { type: [unlinkIntegration.fulfilled], payload: { type: 'messenger' } },
    expected: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          unlinkPending: false,
        },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'unlinkIntegration action is passed for an unknown integration',
    initialState: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: true, type: 'messenger' },
      },
      ids: ['messenger'],
    },
    action: { type: [unlinkIntegration.fulfilled], payload: { type: 'instagram' } },
    expected: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: true, type: 'messenger' },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'Marks an integration as pending',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          linked: true,
          type: 'messenger',
        },
      },
      ids: ['messenger'],
    },
    action: { type: [unlinkIntegration.pending], meta: { arg: { channelId: 'messenger' } } },
    expected: {
      entities: {
        messenger: { _id: 123, linked: true, unlinkPending: true, type: 'messenger' },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'Marks an integration as linked',
    initialState: {
      entities: { messenger: { _id: 123, type: 'messenger', linked: false } },
      ids: ['messenger'],
    },
    action: integrationLinked({ type: 'messenger', clientId: 'abc123' }),
    expected: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          linked: true,
          clientId: 'abc123',
        },
      },
      ids: ['messenger'],
    },
  },
])

describe('getAllIntegrationsLinkStatus', () => {
  it('transforms the integration object to a channels object of true or false', () => {
    const result = getAllIntegrationsLinkStatus({
      integrations: {
        entities: {
          messenger: { linked: true, type: 'messenger' },
          instagram: { linked: false, type: 'instagram' },
          whatsapp: { linked: undefined, type: 'whatsapp' },
        },
        ids: ['messenger', 'instagram', 'whatsapp'],
      },
    })

    expect(result).toMatchInlineSnapshot(`
      Object {
        "instagram": false,
        "messenger": true,
        "whatsapp": undefined,
      }
    `)
  })

  it('returns a key and bool value for all "integrations"', () => {
    const result = getAllIntegrationsLinkStatus({
      integrations: {
        entities: {
          messenger: { linked: true, type: 'messenger' },
        },
        ids: ['messenger'],
      },
    })

    expect(result).toMatchInlineSnapshot(`
      Object {
        "messenger": true,
      }
    `)
  })

  it('returns an empty object when there are no known integrations', () => {
    const result = getAllIntegrationsLinkStatus({ integrations: { entities: {}, ids: [] } })

    expect(result).toEqual({})
  })
})

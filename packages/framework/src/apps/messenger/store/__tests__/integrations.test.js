import {
  fetchExistingConversation,
  integrationLinkCancelled,
  integrationLinked,
  integrationLinkFailed,
} from 'src/apps/messenger/features/suncoConversation/store'
import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import reducer, {
  fetchIntegrations,
  fetchLinkRequest,
  getAllIntegrationsLinkStatus,
  leftChannelPage,
  unlinkIntegration,
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
          linkCancelled: false,
          linkFailed: false,
          unlinkFailed: false,
          unlinkPending: false,
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
          linkCancelled: false,
          linkFailed: false,
          unlinkFailed: false,
          unlinkPending: false,
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
          linkCancelled: false,
          linkFailed: false,
          unlinkFailed: false,
          unlinkPending: false,
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
          linkCancelled: false,
          linkFailed: false,
          unlinkFailed: false,
          unlinkPending: false,
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
          linkCancelled: false,
          linkFailed: false,
          unlinkFailed: false,
          unlinkPending: false,
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
          linkCancelled: false,
          linkFailed: false,
          unlinkFailed: false,
          unlinkPending: false,
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
    extraDesc: 'resets the state variables when the leftChannelPage action is dispatched',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: false,
          type: 'messenger',
          linkRequest: {},
        },
      },
      ids: ['messenger'],
    },
    action: { type: [leftChannelPage], payload: { channelId: 'messenger' } },
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
          linkFailed: false,
          linkCancelled: false,
          unlinkPending: false,
          unlinkFailed: false,
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
          linkCancelled: false,
          linkFailed: false,
          unlinkFailed: false,
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
    extraDesc: 'Marks an integration as unlink pending',
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
        messenger: {
          _id: 123,
          linked: true,
          unlinkFailed: false,
          unlinkPending: true,
          type: 'messenger',
        },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'unlinkIntegration rejected action is dispatched',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: 'linked',
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          unlinkPending: true,
          unlinkFailed: false,
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
    action: {
      type: [unlinkIntegration.rejected],
      meta: { arg: { channelId: 'messenger' } },
    },
    expected: {
      entities: {
        messenger: {
          _id: 123,
          appId: 1,
          pageId: '123',
          linked: 'linked',
          type: 'messenger',
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          unlinkPending: false,
          unlinkFailed: true,
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
          linkCancelled: false,
          linkFailed: false,
        },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'Marks an integration link as cancelled',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          linked: 'not linked',
          linkCancelled: false,
          linkFailed: false,
          unlinkFailed: false,
          unlinkPending: false,
        },
      },
      ids: ['messenger'],
    },
    action: integrationLinkCancelled({ type: 'messenger' }),
    expected: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          linked: 'not linked',
          unlinkPending: false,
          linkFailed: false,
          unlinkFailed: false,
          linkCancelled: true,
        },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'Marks an integration as failed to link',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          linked: 'not linked',
          linkFailed: false,
          linkCancelled: false,
        },
      },
      ids: ['messenger'],
    },
    action: integrationLinkFailed({ type: 'messenger' }),
    expected: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          linked: 'not linked',
          linkFailed: true,
          linkCancelled: false,
        },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'Marks an integration as linked when exists in conversation',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          linked: false,
          linkFailed: false,
          linkCancelled: false,
        },
      },
      ids: ['messenger'],
    },
    action: fetchExistingConversation.fulfilled({
      integrations: [{ platform: 'messenger', id: 'client-id' }],
    }),
    expected: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          clientId: 'client-id',
          linked: true,
          linkFailed: false,
          linkCancelled: false,
        },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'Leaves integrations as is when none exist in conversation',
    initialState: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          linked: false,
          linkFailed: false,
          linkCancelled: false,
        },
      },
      ids: ['messenger'],
    },
    action: fetchExistingConversation.fulfilled({
      integrations: null,
    }),
    expected: {
      entities: {
        messenger: {
          _id: 123,
          type: 'messenger',
          linked: false,
          linkFailed: false,
          linkCancelled: false,
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

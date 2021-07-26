import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import reducer, {
  fetchIntegrations,
  linkIntegration,
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
        messenger: { _id: 123, appId: 1, pageId: 'p1', linked: 'not linked', type: 'messenger' },
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
        messenger: { _id: 123, appId: 1, pageId: 'p1', linked: 'not linked', type: 'messenger' },
        whatsapp: { _id: 234, appId: 2, pageId: 'p2', linked: 'not linked', type: 'whatsapp' },
        instagram: { _id: 345, appId: 3, pageId: 'p3', linked: 'not linked', type: 'instagram' },
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
    extraDesc: 'linkIntegration action is passed for a known integration',
    initialState: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: 'not linked', type: 'messenger' },
      },
      ids: ['messenger'],
    },
    action: { type: [linkIntegration.fulfilled], payload: { type: 'messenger' } },
    expected: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: 'linked', type: 'messenger' },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'linkIntegration action is passed for an unknown integration',
    initialState: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: 'not linked', type: 'messenger' },
      },
      ids: ['messenger'],
    },
    action: { type: [linkIntegration.fulfilled], payload: { type: 'instagram' } },
    expected: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: 'not linked', type: 'messenger' },
      },
      ids: ['messenger'],
    },
  },

  {
    extraDesc: 'unlinkIntegration action is passed for a known integration',
    initialState: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: 'linked', type: 'messenger' },
      },
      ids: ['messenger'],
    },
    action: { type: [unlinkIntegration.fulfilled], payload: { type: 'messenger' } },
    expected: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: 'not linked', type: 'messenger' },
      },
      ids: ['messenger'],
    },
  },
  {
    extraDesc: 'unlinkIntegration action is passed for an unknown integration',
    initialState: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: 'linked', type: 'messenger' },
      },
      ids: ['messenger'],
    },
    action: { type: [unlinkIntegration.fulfilled], payload: { type: 'instagram' } },
    expected: {
      entities: {
        messenger: { _id: 123, appId: 1, pageId: '123', linked: 'linked', type: 'messenger' },
      },
      ids: ['messenger'],
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

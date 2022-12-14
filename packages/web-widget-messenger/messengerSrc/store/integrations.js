import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import {
  fetchIntegrations as fetchIntegrationsSunco,
  fetchLinkRequest as fetchLinkRequestSunco,
  unlinkIntegration as unlinkIntegrationSunco,
} from 'messengerSrc/api/sunco'
import {
  attemptedChannelLink,
  integrationLinkCancelled,
  integrationLinked,
  integrationLinkFailed,
  startConversation,
} from 'messengerSrc/features/suncoConversation/store'

const integrationsAdapter = createEntityAdapter({
  selectId: (integration) => integration.type,
})

const selectors = integrationsAdapter.getSelectors((state) => state.integrations)

export const fetchLinkRequest = createAsyncThunk(
  'integrations/fetchLinkRequest',
  async ({ channelId }, { getState }) => {
    const integration = selectors.selectById(getState(), channelId)
    const response = await fetchLinkRequestSunco(integration._id)

    if (Array.isArray(response.body.linkRequests) && response.body.linkRequests.length === 1) {
      return response.body.linkRequests[0]
    }

    throw new Error(`Failed to fetch link request for integration ${channelId}`)
  }
)

export const unlinkIntegration = createAsyncThunk(
  'integrations/unlink',
  async ({ channelId }, { getState }) => {
    const integration = selectors.selectById(getState(), channelId)
    const response = await unlinkIntegrationSunco(integration.clientId)

    if (response.status !== 200) {
      throw new Error('An error occurred removing the channel.')
    }

    return integration
  }
)

export const setupRequestlessIntegrations = (integrations) => {
  return integrations.map((integration) => {
    switch (integration.type) {
      case 'instagram':
        return {
          ...integration,
          ignoreLinkRequest: true,
          linkRequest: {
            url: `https://instagram.com/${integration.businessUsername}`,
          },
        }
      default:
        return { ...integration }
    }
  })
}

export const fetchIntegrations = createAsyncThunk('integrations/fetch', async () => {
  const response = await fetchIntegrationsSunco()

  return setupRequestlessIntegrations(response?.body?.config?.integrations || [])
})

const integrations = createSlice({
  name: 'integrations',
  initialState: integrationsAdapter.getInitialState({}),
  reducers: {
    leftChannelPage: (state, { payload }) => {
      const { channelId } = payload

      integrationsAdapter.updateOne(state, {
        id: channelId,
        changes: {
          linkFailed: false,
          linkCancelled: false,
          linkPending: false,
          unlinkPending: false,
          unlinkFailed: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          errorFetchingLinkRequest: false,
        },
      })
    },
  },
  extraReducers: {
    [fetchIntegrations.fulfilled]: (state, { payload: integrations }) => {
      const parsedIntegrations = integrations.map((integration) => {
        return {
          ...integration,
          linked: false,
          linkCancelled: false,
          linkFailed: false,
          linkPending: false,
          unlinkPending: false,
          unlinkFailed: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          errorFetchingLinkRequest: false,
          linkRequest: integration.linkRequest || {},
        }
      })

      return integrationsAdapter.addMany(state, parsedIntegrations)
    },
    [fetchLinkRequest.fulfilled]: (state, { payload: linkRequest }) => {
      integrationsAdapter.updateOne(state, {
        id: linkRequest.type,
        changes: {
          hasFetchedLinkRequest: true,
          isFetchingLinkRequest: false,
          errorFetchingLinkRequest: false,
          linkCancelled: false,
          linkFailed: false,
          linkPending: false,
          unlinkPending: false,
          unlinkFailed: false,
          linkRequest,
        },
      })
    },
    [startConversation.fulfilled]: (state, { payload }) => {
      const { integrations } = payload

      if (!integrations) {
        return
      }

      const parsedIntegrations = integrations?.map((integration) => ({
        id: integration.platform,
        changes: {
          linked: true,
          clientId: integration.id,
        },
      }))

      integrationsAdapter.updateMany(state, parsedIntegrations)
    },
    [fetchLinkRequest.pending](
      state,
      {
        meta: {
          arg: { channelId },
        },
      }
    ) {
      integrationsAdapter.updateOne(state, {
        id: channelId,
        changes: {
          linkPending: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: true,
          errorFetchingLinkRequest: false,
        },
      })
    },
    [fetchLinkRequest.rejected](
      state,
      {
        meta: {
          arg: { channelId },
        },
      }
    ) {
      integrationsAdapter.updateOne(state, {
        id: channelId,
        changes: {
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          errorFetchingLinkRequest: true,
        },
      })
    },
    [unlinkIntegration.rejected]: (
      state,
      {
        meta: {
          arg: { channelId },
        },
      }
    ) => {
      integrationsAdapter.updateOne(state, {
        id: channelId,
        changes: { unlinkPending: false, unlinkFailed: true },
      })
    },
    [unlinkIntegration.pending]: (
      state,
      {
        meta: {
          arg: { channelId },
        },
      }
    ) => {
      integrationsAdapter.updateOne(state, {
        id: channelId,
        changes: { unlinkPending: true, unlinkFailed: false },
      })
    },
    [unlinkIntegration.fulfilled]: (state, { payload: integration }) => {
      integrationsAdapter.updateOne(state, {
        id: integration.type,
        changes: {
          linked: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          errorFetchingLinkRequest: false,
          linkCancelled: false,
          linkFailed: false,
          unlinkPending: false,
          unlinkFailed: false,
        },
      })
    },
    [integrationLinked](state, { payload }) {
      const { type, clientId } = payload

      integrationsAdapter.updateOne(state, {
        id: type,
        changes: {
          linked: true,
          linkCancelled: false,
          linkFailed: false,
          linkPending: false,
          clientId,
        },
      })
    },
    [integrationLinkCancelled](state, { payload }) {
      const { type } = payload

      integrationsAdapter.updateOne(state, {
        id: type,
        changes: { linkCancelled: true, linkFailed: false },
      })
    },
    [integrationLinkFailed](state, { payload }) {
      const { type } = payload

      integrationsAdapter.updateOne(state, {
        id: type,
        changes: { linkFailed: true, linkCancelled: false },
      })
    },
    [attemptedChannelLink](state, action) {
      integrationsAdapter.updateOne(state, {
        id: action.payload.channelId,
        changes: {
          linkPending: true,
        },
      })
    },
  },
})

export const getIntegrations = selectors.selectAll
export const selectIntegrationById = selectors.selectById

export const getAllIntegrationsLinkStatus = (state) => {
  const integrations = getIntegrations(state)

  return integrations.reduce((accumulator, current) => {
    accumulator[current.type] = current.linked
    return accumulator
  }, {})
}

export const leftChannelPage = integrations.actions.leftChannelPage

export default integrations.reducer

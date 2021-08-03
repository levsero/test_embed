import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchIntegrations as fetchIntegrationsSunco } from 'src/apps/messenger/api/sunco'
import {
  integrationLinked,
  fetchExistingConversation,
} from 'src/apps/messenger/features/suncoConversation/store'
import {
  fetchLinkRequest as fetchLinkRequestSunco,
  unlinkIntegration as unlinkIntegrationSunco,
} from '../api/sunco'

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

export const fetchIntegrations = createAsyncThunk('integrations/fetch', async () => {
  const response = await fetchIntegrationsSunco()

  return response?.body?.config?.integrations || []
})

const integrations = createSlice({
  name: 'integrations',
  initialState: integrationsAdapter.getInitialState({}),
  extraReducers: {
    [fetchIntegrations.fulfilled]: (state, { payload: integrations }) => {
      const parsedIntegrations = integrations.map((integration) => {
        return {
          ...integration,
          linked: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          errorFetchingLinkRequest: false,
          linkRequest: {},
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
          linkRequest,
        },
      })
    },
    [fetchExistingConversation.fulfilled]: (state, { payload }) => {
      const { integrations } = payload

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
      integrationsAdapter.updateOne(state, { id: channelId, changes: { unlinkPending: false } })
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
        changes: { unlinkPending: true },
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
          unlinkPending: false,
        },
      })
    },
    [integrationLinked](state, { payload }) {
      const { type, clientId } = payload

      integrationsAdapter.updateOne(state, {
        id: type,
        changes: { linked: true, clientId },
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

export default integrations.reducer

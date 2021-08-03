import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchIntegrations as fetchIntegrationsSunco } from 'src/apps/messenger/api/sunco'
import { integrationLinked } from 'src/apps/messenger/features/suncoConversation/store'
import { fetchLinkRequest as fetchLinkRequestSunco } from '../api/sunco'

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

export const unlinkIntegration = createAsyncThunk('integrations/unlink', (type, { getState }) => {
  // To be replaced with the SunCo API unlink
  const integration = selectors.selectById(getState(), type)
  if (integration) {
    return integration
  }
  throw new Error('No integration with that name found!')
})

export const fetchIntegrations = createAsyncThunk('integrations/fetch', async () => {
  const response = await fetchIntegrationsSunco()

  return response?.body?.config?.integrations || []
})

const integrations = createSlice({
  name: 'integrations',
  initialState: integrationsAdapter.getInitialState(),
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
    [unlinkIntegration.fulfilled]: (state, { payload: integration }) => {
      integrationsAdapter.updateOne(state, {
        id: integration.type,
        changes: { linked: false },
      })
    },
    [integrationLinked](state, action) {
      integrationsAdapter.updateOne(state, {
        id: action.payload.integration,
        changes: { linked: true },
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

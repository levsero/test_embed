import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchIntegrations as fetchIntegrationsSunco } from 'src/apps/messenger/api/sunco'
import { fetchLinkRequest } from '../api/sunco'

const LINKED = 'linked'
const NOT_LINKED = 'not linked'

const integrationsAdapter = createEntityAdapter({
  selectId: (integration) => integration.type,
})

const selectors = integrationsAdapter.getSelectors((state) => state.integrations)

export const linkIntegration = createAsyncThunk('integrations/link', async (type, { getState }) => {
  const integration = selectors.selectById(getState(), type)
  const response = await fetchLinkRequest(integration._id)

  return response?.body?.linkRequests[0] || {}
})

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
  initialState: integrationsAdapter.getInitialState({
    hasFetchedLinkRequest: false,
    isFetchingLinkRequest: false,
    errorFetchingLinkRequest: false,
  }),
  extraReducers: {
    [fetchIntegrations.fulfilled]: (state, { payload: integrations }) => {
      const parsedIntegrations = integrations.map((integration) => {
        return {
          ...integration,
          linked: NOT_LINKED,
          linkRequest: {},
        }
      })

      return integrationsAdapter.addMany(state, parsedIntegrations)
    },
    [linkIntegration.fulfilled]: (state, { payload: linkRequest }) => {
      state.hasFetchedLinkRequest = true
      state.isFetchingLinkRequest = false
      state.errorFetchingLinkRequest = false
      integrationsAdapter.updateOne(state, {
        id: linkRequest.type,
        changes: { linked: LINKED, linkRequest },
      })
    },
    [linkIntegration.pending](state) {
      state.hasFetchedLinkRequest = false
      state.isFetchingLinkRequest = true
      state.errorFetchingLinkRequest = false
    },
    [linkIntegration.rejected](state) {
      state.hasFetchedLinkRequest = false
      state.isFetchingLinkRequest = false
      state.errorFetchingLinkRequest = true
    },
    [unlinkIntegration.fulfilled]: (state, { payload: integration }) => {
      integrationsAdapter.updateOne(state, {
        id: integration.type,
        changes: { linked: NOT_LINKED },
      })
    },
  },
  reducers: {},
})

export const getIntegrations = selectors.selectAll
export const selectIntegrationById = selectors.selectById
export const getErrorFetchingLinkRequest = (state) => state.integrations.errorFetchingLinkRequest
export const getIsFetchingLinkRequest = (state) => state.integrations.isFetchingLinkRequest
export const getHasFetchedLinkRequest = (state) => state.integrations.hasFetchedLinkRequest

export const getAllIntegrationsLinkStatus = (state) => {
  const integrations = getIntegrations(state)

  return integrations.reduce((accumulator, current) => {
    accumulator[current.type] = current.linked
    return accumulator
  }, {})
}

export default integrations.reducer

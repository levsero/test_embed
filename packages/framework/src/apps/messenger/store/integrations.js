import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit'
import { fetchIntegrations as fetchIntegrationsSunco } from 'src/apps/messenger/api/sunco'

const LINKED = 'linked'
const NOT_LINKED = 'not linked'

const integrationsAdapter = createEntityAdapter({
  selectId: (integration) => integration.type,
})

const selectors = integrationsAdapter.getSelectors((state) => state.integrations)

export const linkIntegration = createAsyncThunk('integrations/link', (type, { getState }) => {
  // To be replaced with the SunCo API link
  const integration = selectors.selectById(getState(), type)
  if (integration) {
    return integration
  }
  throw new Error('No integration with that name found!')
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
  initialState: integrationsAdapter.getInitialState({}),
  extraReducers: {
    [fetchIntegrations.fulfilled]: (state, { payload: integrations }) => {
      const parsedIntegrations = integrations.map((integration) => {
        return {
          ...integration,
          linked: NOT_LINKED,
        }
      })

      return integrationsAdapter.addMany(state, parsedIntegrations)
    },
    [linkIntegration.fulfilled]: (state, { payload: integration }) => {
      integrationsAdapter.updateOne(state, { id: integration.type, changes: { linked: LINKED } })
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

export const getAllIntegrationsLinkStatus = (state) => {
  const integrations = getIntegrations(state)

  return integrations.reduce((accumulator, current) => {
    accumulator[current.type] = current.linked
    return accumulator
  }, {})
}

export default integrations.reducer

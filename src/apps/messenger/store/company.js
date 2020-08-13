import { createSlice } from '@reduxjs/toolkit'

const company = createSlice({
  name: 'company',
  initialState: {
    name: 'Zendesk',
    avatar:
      'https://www.vhv.rs/dpng/d/263-2633009_transparent-zendesk-logo-white-hd-png-download.png',
    tagline: 'Creating widgets for the modern world'
  },
  reducers: {
    companyReceived: (state, action) => action.payload
  }
})

export const { companyReceived } = company.actions

export const getCompany = state => state.company

export default company.reducer

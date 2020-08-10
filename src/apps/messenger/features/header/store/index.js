import { createSlice } from '@reduxjs/toolkit'

const header = createSlice({
  name: 'header',
  initialState: {
    company: {
      name: 'Zendesk',
      avatar:
        'https://www.vhv.rs/dpng/d/263-2633009_transparent-zendesk-logo-white-hd-png-download.png',
      tagline: 'Creating widgets for the modern world'
    }
  },
  reducers: {
    updateCompany: (state, action) => {
      state = action.payload
    }
  }
})

export const { updateCompany } = header.actions

export const getCompany = state => state.header.company

export default header.reducer

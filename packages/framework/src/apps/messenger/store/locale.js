import { createSlice } from '@reduxjs/toolkit'

const locale = createSlice({
  name: 'locale',
  initialState: {
    locale: null
  },
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload
    }
  }
})

export const { setLocale } = locale.actions

const getLocale = state => state.locale.locale

export { getLocale }

export default locale.reducer

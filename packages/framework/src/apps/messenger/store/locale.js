import { createSlice } from '@reduxjs/toolkit'
import { setLocale as suncoUpdateLocale } from 'src/apps/messenger/api/sunco'

const locale = createSlice({
  name: 'locale',
  initialState: {
    locale: null
  },
  reducers: {
    setLocale: (state, action) => {
      suncoUpdateLocale(action.payload)

      state.locale = action.payload
    }
  }
})

export const { setLocale } = locale.actions

const getLocale = state => state.locale.locale

export { getLocale }

export default locale.reducer

import { createSlice } from '@reduxjs/toolkit'
import i18n from 'src/framework/services/i18n'

const store = createSlice({
  name: 'i18n',
  initialState: {
    locale: null,
  },
  reducers: {
    setLocale: (state, action) => {
      state.locale = action.payload.locale
    },
  },
})

const { setLocale } = store.actions

const subscribeToI18n = () => (dispatch) => {
  i18n.subscribe(() => {
    dispatch(setLocale({ locale: i18n.getLocale() }))
  })

  return i18n.setLocale(i18n.getBrowserLocale())
}

const getLocale = (state) => state.i18n.locale

export { getLocale, subscribeToI18n }

export default store.reducer

import { createSlice } from '@reduxjs/toolkit'

const throwawaySlice = createSlice({
  name: 'throwawaySlice',
  initialState: 0,
  reducers: {
    throwawayAction: state => state + 1
  }
})

export const { throwawayAction } = throwawaySlice.actions

export default throwawaySlice.reducer

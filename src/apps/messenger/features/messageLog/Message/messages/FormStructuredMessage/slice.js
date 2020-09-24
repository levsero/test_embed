import { createSlice } from '@reduxjs/toolkit'
import { submitForm } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/actions'

const getDefaultForm = () => ({
  step: 1,
  values: {},
  status: 'not submitted'
})

const ensureFormInState = (state, formId) => {
  if (!state[formId]) {
    state[formId] = getDefaultForm(formId)
  }
}

const formSlice = createSlice({
  name: 'forms',
  initialState: {},
  reducers: {
    formUpdated: (state, action) => {
      ensureFormInState(state, action.payload.formId)

      state[action.payload.formId].values = action.payload.values
    },
    nextClicked: (state, action) => {
      ensureFormInState(state, action.payload.formId)

      state[action.payload.formId].step += 1
    }
  },
  extraReducers: {
    [submitForm.pending]: (state, action) => {
      ensureFormInState(state, action.meta.arg.formId)

      state[action.meta.arg.formId].status = 'pending'
    },
    [submitForm.fulfilled]: (state, action) => {
      ensureFormInState(state, action.meta.arg.formId)

      state[action.meta.arg.formId].status = 'success'
    },
    [submitForm.rejected]: (state, action) => {
      ensureFormInState(state, action.meta.arg.formId)

      state[action.meta.arg.formId].status = 'failed'
    }
  }
})

const { formUpdated, nextClicked } = formSlice.actions
const getFormsState = state => state.forms
const getFormInfo = (state, formId) => state.forms?.[formId] ?? getDefaultForm()

export { getFormsState, formUpdated, getFormInfo, nextClicked }

export default formSlice.reducer

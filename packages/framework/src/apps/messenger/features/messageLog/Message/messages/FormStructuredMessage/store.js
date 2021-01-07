import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { FORM_MESSAGE_STATUS } from '@zendesk/conversation-components'
import { sendFormResponse } from 'src/apps/messenger/api/sunco'

const getValue = (field, value) => {
  switch (field.type) {
    case 'text':
    case 'email':
      return value.trim()
    default:
      return value
  }
}

const submitForm = createAsyncThunk('form/submit', async ({ formId, fields, values }) => {
  const responseFields = fields.map(field => {
    return {
      type: field.type,
      name: field.name,
      label: field.label,
      [field.type]: getValue(field, values[field._id])
    }
  })

  const response = await sendFormResponse(responseFields, formId)

  if (Array.isArray(response?.body?.messages)) {
    return { messages: response.body.messages }
  }

  return {
    messages: []
  }
})

const getDefaultForm = formId => ({
  _id: formId,
  step: 1,
  values: {},
  formSubmissionStatus: FORM_MESSAGE_STATUS.unsubmitted
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
    stepChanged: (state, action) => {
      ensureFormInState(state, action.payload.formId)

      state[action.payload.formId].step = action.payload.step
    }
  },
  extraReducers: {
    [submitForm.pending]: (state, action) => {
      ensureFormInState(state, action.meta.arg.formId)

      state[action.meta.arg.formId].formSubmissionStatus = FORM_MESSAGE_STATUS.pending
    },
    [submitForm.fulfilled]: (state, action) => {
      ensureFormInState(state, action.meta.arg.formId)

      state[action.meta.arg.formId].formSubmissionStatus = FORM_MESSAGE_STATUS.success
    },
    [submitForm.rejected]: (state, action) => {
      ensureFormInState(state, action.meta.arg.formId)

      state[action.meta.arg.formId].formSubmissionStatus = FORM_MESSAGE_STATUS.failed
    }
  }
})

const { formUpdated, stepChanged } = formSlice.actions
const getFormsState = state => state.forms
const getFormInfo = (state, formId) => state.forms?.[formId] ?? getDefaultForm(formId)

export { getFormsState, formUpdated, getFormInfo, submitForm, stepChanged }

export default formSlice.reducer

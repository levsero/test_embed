import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getClient } from 'src/apps/messenger/suncoClient'

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

  const response = await getClient().sendFormResponse(responseFields, formId)

  if (Array.isArray(response?.body?.messages)) {
    return { messages: response.body.messages }
  }

  return {
    messages: []
  }
})

const getDefaultForm = () => ({
  step: 1,
  values: {},
  status: 'unsubmitted'
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

export { getFormsState, formUpdated, getFormInfo, nextClicked, submitForm }

export default formSlice.reducer

import { createAsyncThunk } from '@reduxjs/toolkit'
import { getClient } from 'src/apps/messenger/suncoClient'

const submitForm = createAsyncThunk('form/submit', async ({ formId, fields, values }) => {
  const responseFields = fields.map(field => {
    return {
      type: field.type,
      name: field.name,
      label: field.label,
      [field.type]: values[field._id]
    }
  })

  const response = await getClient().sendFormResponse(responseFields, formId)

  if (Array.isArray(response?.body?.messages)) {
    return { messages: response.body.messages }
  }
})

export { submitForm }

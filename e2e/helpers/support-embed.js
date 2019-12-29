import { queries, wait } from 'pptr-testing-library'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import loadWidget from './widget-page/fluent'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from './utils'
import widget from './widget'

const mockTicketFormsEndpoint = response => request => {
  if (!request.url().includes('ticket_forms')) {
    return false
  }

  request.respond({
    status: 200,
    headers: DEFAULT_CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(response)
  })
}

const mockTicketFieldsEndpoint = response => request => {
  if (!request.url().includes('ticket_fields')) {
    return false
  }

  request.respond({
    status: 200,
    headers: DEFAULT_CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(response)
  })
}

const mockTicketSubmissionEndpoint = (payload, callback) => {
  return mockCorsRequest('api/v2/requests', request => {
    callback(request.postData())

    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify(payload)
    })
  })
}

const createTicketSubmissionEndpointResponse = (formId, fields) => {
  const { name, email, subject, description, uploads, ...other } = fields

  return JSON.stringify({
    request: {
      subject: subject || description,
      tags: ['web_widget'],
      via_id: 48,
      comment: {
        body: `${description}\n\n------------------\nSubmitted from: http://localhost:5123/e2e.html`,
        uploads: uploads || []
      },
      requester: { name, email, locale_id: 1176 },
      ticket_form_id: formId,
      fields: other
    }
  })
}

let id = 1
const createField = (values = {}) => {
  const fieldId = values.id || id++

  return {
    id: fieldId,
    description: `Description for field ${fieldId}`,
    position: 1,
    title_in_portal: `Title for field ${fieldId}`,
    visible_in_portal: true,
    editable_in_portal: true,
    required_in_portal: true,
    ...values
  }
}

const createForm = (name, id, ...fields) => {
  const form = {
    id,
    display_name: name,
    ticket_field_ids: fields.map(field => field.id)
  }

  const mockFormsResponse = {
    ticket_forms: [form],
    ticket_fields: fields
  }

  const embedConfig = {
    ticketForms: [id],
    nameFieldEnabled: false
  }

  return {
    form,
    mockFormsResponse,
    embedConfig,
    fields
  }
}

export const testForm = async ({ config, mockFormsResponse, mockFieldsResponse }) => {
  const mockSubmissionEndpoint = jest.fn()

  await loadWidget()
    .withPresets('contactForm', {
      embeds: {
        ticketSubmissionForm: {
          props: config
        }
      }
    })
    .intercept(mockTicketFormsEndpoint(mockFormsResponse))
    .intercept(mockTicketSubmissionEndpoint({ request: { id: 123 } }, mockSubmissionEndpoint))
    .intercept(mockTicketFieldsEndpoint(mockFieldsResponse))
    .load()

  await widget.openByKeyboard()

  const emailElement = await queries.queryByLabelText(await widget.getDocument(), 'Email address')
  await allowsInputTextEditing(emailElement, 'fake@example.com')

  const submitButton = await queries.getByText(await widget.getDocument(), 'Send')

  const submit = async () => {
    await submitButton.click()
  }

  const expectSuccess = async (formId, values = {}) => {
    await submit()
    await waitForSubmissionSuccess()

    expect(mockSubmissionEndpoint).toHaveBeenCalledWith(
      createTicketSubmissionEndpointResponse(formId, {
        email: 'fake@example.com',
        name: 'Fake',
        ...values
      })
    )
  }

  return {
    submit,
    expectSuccess
  }
}

const waitForContactForm = async () => {
  const doc = await widget.getDocument()
  await wait(() => queries.getByText(doc, 'Leave us a message'))
}

const waitForSubmissionSuccess = async () => {
  const doc = await widget.getDocument()
  await wait(() => queries.getByText(doc, 'Message sent'))
}

const uploadFiles = async (...filePaths) => {
  const doc = await widget.getDocument()
  const upload = await queries.getByTestId(doc, 'dropzone-input')
  filePaths.forEach(path => upload.uploadFile(path))
}

export {
  mockTicketFieldsEndpoint,
  mockTicketFormsEndpoint,
  mockTicketSubmissionEndpoint,
  createTicketSubmissionEndpointResponse,
  createField,
  createForm,
  waitForContactForm,
  uploadFiles,
  waitForSubmissionSuccess
}

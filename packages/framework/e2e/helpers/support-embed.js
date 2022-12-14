import { hostWithPort } from 'e2e/env'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import { queries } from 'pptr-testing-library'
import { DEFAULT_CORS_HEADERS, mockCorsRequest } from './utils'
import widget from './widget'
import loadWidget from './widget-page'

const mockTicketFormsEndpoint = (response) => (request) => {
  if (!request.url().includes('ticket_forms')) {
    return false
  }

  request.respond({
    status: 200,
    headers: DEFAULT_CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(response),
  })
}

const mockTicketFieldsEndpoint = (response) => (request) => {
  if (!request.url().includes('ticket_fields')) {
    return false
  }

  request.respond({
    status: 200,
    headers: DEFAULT_CORS_HEADERS,
    contentType: 'application/json',
    body: JSON.stringify(response),
  })
}

const mockTicketSubmissionEndpoint = (payload, callback) => {
  return mockCorsRequest('api/v2/requests', (request) => {
    if (callback) {
      callback(request.postData())
    }

    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify(payload),
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
        body: `${description}\n\n------------------\nSubmitted from: http://${hostWithPort}/e2e.html`,
        uploads: uploads || [],
      },
      requester: { name, email, locale_id: 1176 },
      ticket_form_id: formId,
      fields: other,
    },
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
    ...values,
  }
}

const createForm = ({ name, id, active = true, fields = [] }) => {
  const form = {
    id,
    active,
    display_name: name,
    ticket_field_ids: fields.map((field) => field.id),
  }

  const mockFormsResponse = {
    ticket_forms: [form],
    ticket_fields: fields,
  }

  const embedConfig = {
    ticketFormsEnabled: true,
    nameFieldEnabled: false,
  }

  return {
    form,
    mockFormsResponse,
    embedConfig,
    fields,
  }
}

export const testForm = async ({ config, mockFormsResponse, mockFieldsResponse }) => {
  const mockSubmissionEndpoint = jest.fn()

  await loadWidget()
    .withPresets('contactForm', {
      embeds: {
        ticketSubmissionForm: {
          props: config,
        },
      },
    })
    .intercept(mockTicketFormsEndpoint(mockFormsResponse))
    .intercept(mockTicketSubmissionEndpoint({ request: { id: 123 } }, mockSubmissionEndpoint))
    .intercept(mockTicketFieldsEndpoint(mockFieldsResponse))
    .load()

  await widget.openByKeyboard()
  await waitForContactForm()

  const doc = await widget.getDocument()
  const emailElement = await queries.queryByLabelText(doc, 'Email address')
  await allowsInputTextEditing(emailElement, 'fake@example.com')

  const submitButton = await queries.getByText(doc, 'Send')

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
        ...values,
      })
    )
  }

  return {
    submit,
    expectSuccess,
  }
}

const waitForContactForm = async () => {
  await widget.waitForText('Leave us a message', { exact: 'false' })
}

const waitForSubmissionSuccess = async () => {
  await widget.waitForText('Message sent')
}

const uploadFiles = async (...filePaths) => {
  const doc = await widget.getDocument()
  const upload = await queries.getByTestId(doc, 'dropzone-input')
  filePaths.forEach((path) => upload.uploadFile(path))
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
  waitForSubmissionSuccess,
}

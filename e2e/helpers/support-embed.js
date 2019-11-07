import { queries } from 'pptr-testing-library'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import widgetPage from './widget-page'
import { mockEmbeddableConfigEndpoint } from './widget-page/embeddable-config'
import widget from './widget'

const mockTicketFormsEndpoint = response => request => {
  if (!request.url().includes('ticket_forms')) {
    return false
  }

  request.respond({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
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
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentType: 'application/json',
    body: JSON.stringify(response)
  })
}

const mockTicketSubmissionEndpoint = callback => request => {
  if (!request.url().includes('api/v2/requests')) {
    return false
  }

  callback(request.postData())

  request.respond({
    status: 200,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentType: 'application/json',
    body: JSON.stringify({ request: { id: 123 } })
  })
}

const createTicketSubmissionEndpointResponse = (formId, fields) => {
  const { name, email, subject, description, ...other } = fields

  return JSON.stringify({
    request: {
      subject: subject || description,
      tags: ['web_widget'],
      via_id: 48,
      comment: {
        body: `${description}\n\n------------------\nSubmitted from: http://localhost:5123/e2e.html`,
        uploads: []
      },
      requester: { name, email, locale_id: 1176 },
      ticket_form_id: formId,
      fields: other
    }
  })
}

let id = 1
const createField = (values = {}) => {
  const fieldId = id++

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

const createForm = (name, ...fields) => {
  const form = {
    id: 123,
    display_name: name,
    ticket_field_ids: fields.map(field => field.id)
  }

  const mockFormsResponse = {
    ticket_forms: [form],
    ticket_fields: fields
  }

  const embedConfig = {
    ticketForms: [123],
    ticketFields: fields.map(field => field.id),
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

  await widgetPage.load({
    mockRequests: [
      mockEmbeddableConfigEndpoint('contactForm', {
        embeds: {
          ticketSubmissionForm: {
            props: config
          }
        }
      }),
      mockTicketFormsEndpoint(mockFormsResponse),
      mockTicketSubmissionEndpoint(mockSubmissionEndpoint),
      mockTicketFieldsEndpoint(mockFieldsResponse)
    ]
  })

  await widget.openByKeyboard()

  const emailElement = await queries.queryByLabelText(await widget.getDocument(), 'Email address')
  await allowsInputTextEditing(emailElement, 'fake@example.com')

  const submitButton = await queries.getByText(await widget.getDocument(), 'Send')

  const submit = async () => {
    await submitButton.click()
  }

  const expectSuccess = async (formId, values = {}) => {
    await submit()

    const widgetDocument = await widget.getDocument()
    await expect(await widgetDocument.$('body')).toMatch('Message sent')

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

export {
  mockTicketFieldsEndpoint,
  mockTicketFormsEndpoint,
  mockTicketSubmissionEndpoint,
  createTicketSubmissionEndpointResponse,
  createField,
  createForm
}

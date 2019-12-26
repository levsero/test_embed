import widgetPage from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'
import { mockTicketFormsEndpoint, createField, createForm } from 'e2e/helpers/support-embed'
import { queries, wait } from 'pptr-testing-library'
import { DEFAULT_CORS_HEADERS, assertInputValue } from 'e2e/helpers/utils'

const setup = async () => {
  const description = createField({ id: 1, title_in_portal: 'Description', type: 'description' })
  const text = createField({ id: 3, title_in_portal: 'Text field', type: 'text' })
  const textarea = createField({ id: 4, type: 'textarea' })
  const integer = createField({ id: 5, type: 'integer' })
  const form1 = createForm('Example form 1', 123, createField({ type: 'checkbox' }, description))
  const form2 = createForm('Example form 2', 456, description, text, textarea, integer)
  const mockConfigWithForms = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketForms: [form1.form.id, form2.form.id]
        }
      }
    }
  }
  const mockFormsResponse = {
    ticket_forms: form1.mockFormsResponse.ticket_forms.concat(form2.mockFormsResponse.ticket_forms),
    ticket_fields: form1.mockFormsResponse.ticket_fields.concat(
      form2.mockFormsResponse.ticket_fields
    )
  }
  await widgetPage.load({
    mockRequests: [
      mockEmbeddableConfigEndpoint('contactForm', mockConfigWithForms),
      mockTicketFormsEndpoint(mockFormsResponse)
    ],
    preload: (form1Id, form2Id, textId) => {
      window.zESettings = {
        webWidget: {
          contactForm: {
            ticketForms: [
              {
                id: form1Id,
                fields: [
                  {
                    id: 'description',
                    prefill: {
                      '*': 'hello world',
                      fr: 'Bonjour le monde'
                    }
                  }
                ]
              },
              {
                id: form2Id,
                fields: [
                  {
                    id: 'description',
                    prefill: {
                      '*': 'My field text',
                      fr: 'My french field text'
                    }
                  },
                  {
                    id: textId,
                    prefill: {
                      '*': 'random',
                      fr: 'fischer random'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    },
    preloadArgs: [form1.form.id, form2.form.id, text.id]
  })
}

test('prefills the expected form fields', async () => {
  await setup()
  await widget.openByKeyboard()
  const doc = await widget.getDocument()

  const form1Link = await queries.getByText(doc, 'Example form 1')
  await form1Link.click()
  await assertInputValue('Description', 'hello world')
  await widget.clickBack()

  const form2Link = await queries.getByText(doc, 'Example form 2')
  await form2Link.click()
  await assertInputValue('Description', 'My field text')
  await assertInputValue('Text field', 'random')
})

test('prefills by locale', async () => {
  await setup()
  await page.evaluate(() => {
    zE('webWidget', 'setLocale', 'fr')
  })
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  const form2Link = await queries.getByText(doc, 'Example form 2')
  await form2Link.click()
  await assertInputValue('Description', 'My french field text')
  await assertInputValue('Text field', 'fischer random')
})

test('filters the ticket forms', async () => {
  const description = createField({ id: 1, title_in_portal: 'Description', type: 'description' })
  const form1 = createForm('Example form 1', 123, description)
  const form2 = createForm('Example form 2', 456, description)
  const mockConfigWithForms = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketForms: [form1.form.id, form2.form.id]
        }
      }
    }
  }

  const ticketForms = jest.fn()
  const mockTicketFormsEndpoint = request => {
    if (!request.url().includes('ticket_forms')) {
      return false
    }
    ticketForms(request.url())
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify({
        ticket_forms: form2.mockFormsResponse.ticket_forms,
        ticket_fields: [form2.mockFormsResponse.ticket_fields]
      })
    })
  }

  await widgetPage.load({
    mockRequests: [
      mockEmbeddableConfigEndpoint('contactForm', mockConfigWithForms),
      mockTicketFormsEndpoint
    ],
    preload: formId => {
      window.zESettings = {
        webWidget: {
          contactForm: {
            ticketForms: [
              {
                id: formId
              }
            ]
          }
        }
      }
    },
    preloadArgs: [form2.form.id]
  })
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Example form 2')).toBeTruthy()
  })
  expect(await queries.queryByText(doc, 'Example form 1')).toBeNull()
  expect(ticketForms).toHaveBeenCalledWith(
    expect.stringContaining(`ids=${form2.form.id}&include=ticket_fields`)
  )
})

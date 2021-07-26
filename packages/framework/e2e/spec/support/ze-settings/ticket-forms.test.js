import {
  mockTicketFormsEndpoint,
  createField,
  createForm,
  waitForContactForm,
} from 'e2e/helpers/support-embed'
import { DEFAULT_CORS_HEADERS, assertInputValue } from 'e2e/helpers/utils'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries, wait } from 'pptr-testing-library'

const setup = async () => {
  const description = createField({ id: 1, title_in_portal: 'Description', type: 'description' })
  const text = createField({ id: 3, title_in_portal: 'Text field', type: 'text' })
  const textarea = createField({ id: 4, type: 'textarea' })
  const integer = createField({ id: 5, type: 'integer' })
  const form1 = createForm({
    name: 'Example form 1',
    id: 123,
    fields: [createField({ type: 'checkbox' }, description)],
  })
  const form2 = createForm({
    name: 'Example form 2',
    id: 456,
    fields: [description, text, textarea, integer],
  })
  const mockConfigWithForms = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketFormsEnabled: true,
        },
      },
    },
  }
  const mockFormsResponse = {
    ticket_forms: form1.mockFormsResponse.ticket_forms.concat(form2.mockFormsResponse.ticket_forms),
    ticket_fields: form1.mockFormsResponse.ticket_fields.concat(
      form2.mockFormsResponse.ticket_fields
    ),
  }
  await loadWidget()
    .withPresets('contactForm', mockConfigWithForms)
    .intercept(mockTicketFormsEndpoint(mockFormsResponse))
    .evaluateOnNewDocument(
      (form1Id, form2Id, textId) => {
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
                        fr: 'Bonjour le monde',
                      },
                    },
                  ],
                },
                {
                  id: form2Id,
                  fields: [
                    {
                      id: 'description',
                      prefill: {
                        '*': 'My field text',
                        fr: 'My french field text',
                      },
                    },
                    {
                      id: textId,
                      prefill: {
                        '*': 'random',
                        fr: 'fischer random',
                      },
                    },
                  ],
                },
              ],
            },
          },
        }
      },
      form1.form.id,
      form2.form.id,
      text.id
    )
    .load()
}

test('prefills the expected form fields', async () => {
  await setup()
  await widget.openByKeyboard()
  const doc = await widget.getDocument()

  await waitForContactForm()
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
  await wait(() => queries.getByText(doc, 'Laissez-nous un message'))
  const form2Link = await queries.getByText(doc, 'Example form 2')
  await form2Link.click()

  await assertInputValue('Description', 'My french field text')
  await assertInputValue('Text field', 'fischer random')
})

test('filters the ticket forms', async () => {
  const description = createField({ id: 1, title_in_portal: 'Description', type: 'description' })
  const form = createForm({ name: 'Example form 2', id: 456, fields: [description] })
  const mockConfigWithForms = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketFormsEnabled: true,
        },
      },
    },
  }

  const ticketForms = jest.fn()
  const mockTicketFormsEndpoint = (request) => {
    if (!request.url().includes('ticket_forms')) {
      return false
    }
    ticketForms(request.url())
    request.respond({
      status: 200,
      headers: DEFAULT_CORS_HEADERS,
      contentType: 'application/json',
      body: JSON.stringify({
        ticket_forms: form.mockFormsResponse.ticket_forms,
        ticket_fields: form.mockFormsResponse.ticket_fields,
      }),
    })
  }

  await loadWidget()
    .withPresets('contactForm', mockConfigWithForms)
    .intercept(mockTicketFormsEndpoint)
    .evaluateOnNewDocument((formId) => {
      window.zESettings = {
        webWidget: {
          contactForm: {
            ticketForms: [
              {
                id: formId,
              },
            ],
          },
        },
      }
    }, form.form.id)
    .load()
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Example form 2')).toBeTruthy()
  })
  expect(await queries.queryByText(doc, 'Example form 1')).toBeNull()
  expect(ticketForms).toHaveBeenCalledWith(
    expect.stringContaining(`ids=${form.form.id}&include=ticket_fields`)
  )
})

describe('disable ticket form title', () => {
  const setup = () => {
    const description = createField({ id: 1, title_in_portal: 'Description', type: 'description' })
    const form = createForm({
      name: 'Example form',
      id: 123,
      fields: [createField({ type: 'checkbox' }, description)],
    })
    const mockConfigWithForms = {
      embeds: {
        ticketSubmissionForm: {
          props: {
            ticketFormsEnabled: true,
          },
        },
      },
    }
    const mockFormsResponse = {
      ticket_forms: form.mockFormsResponse.ticket_forms,
      ticket_fields: form.mockFormsResponse.ticket_fields,
    }
    return {
      loader: loadWidget()
        .withPresets('contactForm', mockConfigWithForms)
        .intercept(mockTicketFormsEndpoint(mockFormsResponse)),
      form,
    }
  }

  test('hides the ticket form title on prerender', async () => {
    const { loader, form } = setup()
    await loader
      .evaluateOnNewDocument((formId) => {
        window.zESettings = {
          webWidget: {
            contactForm: {
              ticketForms: [{ id: formId, title: false }],
            },
          },
        }
      }, form.form.id)
      .load()
    await widget.openByKeyboard()
    await waitForContactForm()
    await widget.expectNotToSeeText('Example form')
  })

  test('hides the ticket form title using updateSettings', async () => {
    const { loader, form } = setup()
    await loader.load()
    await widget.openByKeyboard()
    await waitForContactForm()
    await widget.expectToSeeText('Example form')
    await page.evaluate((formId) => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: formId, title: false }],
          },
        },
      })
    }, form.form.id)
    await widget.expectNotToSeeText('Example form')
  })
})

test('suppresses the subject field if specified via API', async () => {
  const textarea = createField({ id: 4, type: 'textarea', title_in_portal: 'Description, yo' })
  const subject = createField({ id: 45, title_in_portal: 'Subject', type: 'subject' })
  const theForm = createForm({ name: 'Superfantastic form', id: 123, fields: [subject, textarea] })

  const mockConfigWithForms = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketFormsEnabled: true,
        },
      },
    },
  }

  const mockFormsResponse = {
    ticket_forms: theForm.mockFormsResponse.ticket_forms,
    ticket_fields: theForm.mockFormsResponse.ticket_fields,
  }

  await loadWidget()
    .withPresets('contactForm', mockConfigWithForms)
    .intercept(mockTicketFormsEndpoint(mockFormsResponse))
    .evaluateOnNewDocument((form) => {
      window.zESettings = {
        webWidget: {
          contactForm: {
            ticketForms: [
              {
                id: form.form.id,
                subject: false,
              },
            ],
          },
        },
      }
    }, theForm)
    .load()
  await widget.openByKeyboard()

  await wait(() => widget.expectToSeeText('Superfantastic form'))

  await widget.expectNotToSeeText('Subject')
})

describe('field descriptions (or hints)', () => {
  const textarea = createField({
    id: 4,
    type: 'textarea',
    title_in_portal: 'Description, yo',
    description: 'this description is lukewarm',
  })
  const theForm = createForm({ name: 'Superfantastic form', id: 123, fields: [textarea] })

  const mockConfigWithForms = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketFormsEnabled: true,
        },
      },
    },
  }

  const mockFormsResponse = {
    ticket_forms: theForm.mockFormsResponse.ticket_forms,
    ticket_fields: theForm.mockFormsResponse.ticket_fields,
  }

  test('it overrides the hint if passed a proper one', async () => {
    await loadWidget()
      .withPresets('contactForm', mockConfigWithForms)
      .intercept(mockTicketFormsEndpoint(mockFormsResponse))
      .evaluateOnNewDocument((form) => {
        window.zESettings = {
          webWidget: {
            contactForm: {
              ticketForms: [
                {
                  id: form.form.id,
                  fields: [
                    {
                      id: 4,
                      prefill: { '*': 'sas' },
                      hint: { '*': 'this description is more à propos' },
                    },
                  ],
                },
              ],
            },
          },
        }
      }, theForm)
      .load()
    await widget.openByKeyboard()

    await wait(() => widget.expectToSeeText('this description is more à propos'))
    await widget.expectNotToSeeText('this description is lukewarm')
  })

  test('it overrides the hint with null if passed hideHint: true', async () => {
    await loadWidget()
      .withPresets('contactForm', mockConfigWithForms)
      .intercept(mockTicketFormsEndpoint(mockFormsResponse))
      .evaluateOnNewDocument((form) => {
        window.zESettings = {
          webWidget: {
            contactForm: {
              ticketForms: [
                {
                  id: form.form.id,
                  fields: [
                    {
                      id: 4,
                      prefill: { '*': 'sas' },
                      hideHint: true,
                    },
                  ],
                },
              ],
            },
          },
        }
      }, theForm)
      .load()
    await widget.openByKeyboard()
    await waitForContactForm()

    await widget.expectNotToSeeText('this description is lukewarm')
  })

  test('does not override the hint otherwise', async () => {
    await loadWidget()
      .withPresets('contactForm', mockConfigWithForms)
      .intercept(mockTicketFormsEndpoint(mockFormsResponse))
      .load()
    await widget.openByKeyboard()

    await wait(() => widget.expectToSeeText('this description is lukewarm'))
    await widget.expectNotToSeeText('this description is more à propos')
  })
})

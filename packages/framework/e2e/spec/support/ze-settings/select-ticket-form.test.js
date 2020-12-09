import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockTicketFormsEndpoint, createField, createForm } from 'e2e/helpers/support-embed'
import { queries, wait } from 'pptr-testing-library'

beforeEach(async () => {
  const form1 = createForm({
    name: 'Example form 1',
    id: 123,
    fields: [createField({ type: 'checkbox' })]
  })
  const form2 = createForm({
    name: 'Example form 2',
    id: 456,
    fields: [createField({ type: 'text' })]
  })
  const mockConfigWithForms = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketFormsEnabled: true
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
  await loadWidget()
    .withPresets('contactForm', mockConfigWithForms)
    .intercept(mockTicketFormsEndpoint(mockFormsResponse))
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          contactForm: {
            selectTicketForm: {
              '*': 'Please choose:',
              fr: 'Please choose, but in French:'
            }
          }
        }
      }
    })
    .load()
})

test('customize the forms prompt', async () => {
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Please choose:')).not.toBeNull()
  })
})

test('selects the proper locale', async () => {
  await page.evaluate(() => {
    zE('webWidget', 'setLocale', 'fr')
  })
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Please choose, but in French:')).not.toBeNull()
  })
})
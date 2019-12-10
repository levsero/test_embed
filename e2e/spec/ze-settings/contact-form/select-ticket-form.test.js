import widgetPage from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'
import { mockTicketFormsEndpoint, createField, createForm } from 'e2e/helpers/support-embed'
import { queries } from 'pptr-testing-library'

beforeEach(async () => {
  const form1 = createForm('Example form 1', 123, createField({ type: 'checkbox' }))
  const form2 = createForm('Example form 2', 456, createField({ type: 'text' }))
  const mockConfigWithForms = {
    embeds: {
      ticketSubmissionForm: {
        props: {
          ticketForms: [form1.form.id, form2.form.id],
          ticketFields: form1.fields.concat(form2.fields).map(field => field.id)
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
    preload: () => {
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
    }
  })
})

test('customize the forms prompt', async () => {
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  expect(await queries.queryByText(doc, 'Please choose:')).not.toBeNull()
})

test('selects the proper locale', async () => {
  await page.evaluate(() => {
    zE('webWidget', 'setLocale', 'fr')
  })
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  expect(await queries.queryByText(doc, 'Please choose, but in French:')).not.toBeNull()
})

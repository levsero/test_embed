import { queryAllByText } from 'e2e/helpers/queries'
import {
  mockTicketFormsEndpoint,
  createField,
  createForm,
  waitForContactForm,
} from 'e2e/helpers/support-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries } from 'pptr-testing-library'

describe('support list page', () => {
  describe('when config returns multiple ticket forms', () => {
    it('displays a list of active ticket forms', async () => {
      const form1 = createForm({
        name: 'Example form 1',
        id: 123,
        fields: [createField({ type: 'checkbox' })],
        active: true,
      })
      const form2 = createForm({
        name: 'Example form 2',
        id: 456,
        fields: [createField({ type: 'text' })],
        active: false,
      })
      const form3 = createForm({
        name: 'Example form 3',
        id: 789,
        fields: [createField({ type: 'text' })],
        active: true,
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
        ticket_forms: [
          ...form1.mockFormsResponse.ticket_forms,
          ...form2.mockFormsResponse.ticket_forms,
          ...form3.mockFormsResponse.ticket_forms,
        ],
        ticket_fields: [
          ...form1.mockFormsResponse.ticket_fields,
          ...form2.mockFormsResponse.ticket_fields,
          ...form3.mockFormsResponse.ticket_fields,
        ],
      }

      await loadWidget()
        .withPresets('contactForm', mockConfigWithForms)
        .intercept(mockTicketFormsEndpoint(mockFormsResponse))
        .load()

      await widget.openByKeyboard()
      await waitForContactForm()

      await expect(
        await queryAllByText([form1.form.display_name, form3.form.display_name])
      ).toAppearInOrder()

      const doc = await widget.getDocument()
      await expect(await queries.queryByText(doc, form2.form.display_name)).toBeNull()
      await expect(page).toPassAxeTests()
    })
  })
})

import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockTicketFormsEndpoint, createField, createForm } from 'e2e/helpers/support-embed'
import { queryAllByText } from 'e2e/helpers/queries'

describe('support list page', () => {
  describe('when config returns multiple ticket forms', () => {
    it('displays a list of ticket forms', async () => {
      const form1 = createForm('Example form 1', 123, createField({ type: 'checkbox' }))
      const form2 = createForm('Example form 2', 456, createField({ type: 'text' }))

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
        ticket_forms: form1.mockFormsResponse.ticket_forms.concat(
          form2.mockFormsResponse.ticket_forms
        ),
        ticket_fields: form1.mockFormsResponse.ticket_fields.concat(
          form2.mockFormsResponse.ticket_fields
        )
      }

      await loadWidget()
        .withPresets('contactForm', mockConfigWithForms)
        .intercept(mockTicketFormsEndpoint(mockFormsResponse))
        .load()

      await widget.openByKeyboard()

      await expect(
        await queryAllByText([form1.form.display_name, form2.form.display_name])
      ).toAppearInOrder()
    })
  })
})

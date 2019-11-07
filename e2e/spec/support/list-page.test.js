import _ from 'lodash'
import widgetPage from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'
import { mockTicketFormsEndpoint, createField, createForm } from 'e2e/helpers/support-embed'
import { queryAllByText } from 'e2e/helpers/queries'

describe('support list page', () => {
  describe('when config returns multiple ticket forms', () => {
    it('displays a list of ticket forms', async () => {
      const form1 = createForm('Example form 1', createField({ type: 'checkbox' }))
      const form2 = createForm('Example form 1', createField({ type: 'text' }))

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

      const mockFormsResponse = _.merge(form1.mockFormsResponse, form2.mockFormsResponse)

      await widgetPage.load({
        mockRequests: [
          mockEmbeddableConfigEndpoint('contactForm', mockConfigWithForms),
          mockTicketFormsEndpoint(mockFormsResponse)
        ]
      })

      await widget.openByKeyboard()

      await expect(
        await queryAllByText([form1.form.display_name, form2.form.display_name])
      ).toAppearInOrder()
    })
  })
})

import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { queries, wait } from 'pptr-testing-library'

test('sets the ticket form title based on config', async () => {
  await loadWidget()
    .withPresets('contactForm', {
      embeds: {
        ticketSubmissionForm: {
          props: {
            formTitleKey: 'contact'
          }
        }
      }
    })
    .load()
  await launcher.click()
  const doc = await widget.getDocument()
  await wait(async () => {
    const title = await queries.queryByText(doc, 'Contact us')
    expect(title).toBeTruthy()
  })
})

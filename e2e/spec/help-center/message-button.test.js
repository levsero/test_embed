import { queries, wait } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'

describe('message button', () => {
  const assertContactForm = async doc => {
    expect(await queries.queryByLabelText(doc, 'Your name (optional)')).toBeTruthy()
    expect(await queries.queryByLabelText(doc, 'How can we help you?')).toBeTruthy()
    expect(await queries.queryByText(doc, 'Send')).toBeTruthy()
  }

  it('displays the button in the footer, and clicking it leads to the contact form', async () => {
    await widgetPage.loadWithConfig(
      'helpCenterWithContextualHelp',
      'contactForm',
      mockSearchEndpoint({ results: [] })
    )

    await launcher.click()
    const doc = await widget.getDocument()

    await wait(async () => {
      const button = await queries.queryByText(doc, 'Leave us a message')
      expect(button).toBeTruthy()
      await button.click()
    })
    await assertContactForm(doc)
  })

  test('label can be overridden by settings', async () => {
    await widgetPage.loadWithConfig(
      'helpCenterWithContextualHelp',
      'contactForm',
      mockSearchEndpoint()
    )

    page.evaluate(() => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          helpCenter: {
            messageButton: {
              '*': 'Contact us now.'
            }
          }
        }
      })
    })

    await launcher.click()
    const doc = await widget.getDocument()
    await wait(async () => {
      const button = await queries.queryByText(doc, 'Contact us now.')
      expect(button).toBeTruthy()
      await button.click()
    })
    await assertContactForm(doc)
  })
})

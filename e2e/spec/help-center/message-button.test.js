import { queries } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'

describe('message button', () => {
  const assertContactForm = async doc => {
    expect(await queries.queryByLabelText(doc, 'Your name (optional)')).toBeTruthy()
    expect(await queries.queryByLabelText(doc, 'How can we help you?')).toBeTruthy()
    expect(await queries.queryByText(doc, 'Send')).toBeTruthy()
  }

  const buildWidget = () => loadWidget().withPresets('helpCenterWithContextualHelp', 'contactForm')

  it('displays the button in the footer, and clicking it leads to the contact form', async () => {
    await buildWidget()
      .intercept(mockSearchEndpoint({ results: [] }))
      .load()

    await launcher.click()
    await waitForHelpCenter()
    const doc = await widget.getDocument()
    const button = await queries.queryByText(doc, 'Leave us a message')
    expect(button).toBeTruthy()
    await button.click()
    await assertContactForm(doc)
  })

  test('label can be overridden by settings', async () => {
    await buildWidget()
      .intercept(mockSearchEndpoint())
      .load()

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
    await waitForHelpCenter()
    const doc = await widget.getDocument()
    const button = await queries.queryByText(doc, 'Contact us now.')
    expect(button).toBeTruthy()
    await button.click()
    await assertContactForm(doc)
  })

  it('uses the label from config', async () => {
    await loadWidget()
      .withPresets('contactForm', 'helpCenterWithContextualHelp', {
        embeds: {
          helpCenterForm: {
            props: {
              buttonLabelKey: 'contact'
            }
          }
        }
      })
      .intercept(mockSearchEndpoint())
      .load()
    await launcher.click()
    await waitForHelpCenter()
    const doc = await widget.getDocument()
    const button = await queries.queryByText(doc, 'Contact us')
    expect(button).toBeTruthy()
  })
})

import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import { waitForContactForm } from 'e2e/helpers/support-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries } from 'pptr-testing-library'

describe('message button', () => {
  const assertContactForm = async (doc) => {
    await waitForContactForm()
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
    await buildWidget().intercept(mockSearchEndpoint()).load()

    page.evaluate(() => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          helpCenter: {
            messageButton: {
              '*': 'Contact us now.',
            },
          },
        },
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
})

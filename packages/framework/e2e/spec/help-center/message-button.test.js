import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'
import { queries, wait } from 'pptr-testing-library'

test('use the label from config', async () => {
  await loadWidget()
    .withPresets('contactForm', 'helpCenterWithContextualHelp', {
      embeds: {
        helpCenterForm: {
          props: {
            buttonLabelKey: 'contact',
          },
        },
      },
    })
    .intercept(mockSearchEndpoint())
    .load()
  await launcher.click()
  await waitForHelpCenter()

  const doc = await widget.getDocument()
  const button = await queries.queryByText(doc, 'Contact us')
  expect(button).toBeTruthy()

  await wait(() => expect(button).toBeTruthy())
})

test('use chat as contact option when chat is online', async () => {
  await loadWidget()
    .withPresets('contactForm', 'chat', 'helpCenterWithContextualHelp')
    .intercept(mockSearchEndpoint())
    .load()
  await zChat.online()
  await launcher.click()
  await waitForHelpCenter()

  await widget.waitForText('Live chat')
  await widget.clickText('Live chat')
  await widget.waitForText('Chat with us')
})

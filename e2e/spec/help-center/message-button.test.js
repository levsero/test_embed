import { queries, wait } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import zChat from 'e2e/helpers/zChat'

test('use the label from config', async () => {
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
  const doc = await widget.getDocument()
  const button = await queries.queryByText(doc, 'Live chat')

  await wait(() => expect(button).toBeTruthy())

  await button.click()
  const chat = await queries.queryByText(doc, 'Chat with us')

  await wait(() => expect(chat).toBeTruthy())
})

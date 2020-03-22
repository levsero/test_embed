import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot, waitForGetInTouchButton } from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'
import zChat from 'e2e/helpers/zChat'

const buildWidget = () => loadWidget().withPresets('answerBot')

test('override contact form label', async () => {
  await buildWidget()
    .withPresets('contactForm')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          contactOptions: {
            contactFormLabel: {
              '*': 'submit tix',
              fr: 'the french'
            }
          }
        }
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await waitForGetInTouchButton()
  const doc = await widget.getDocument()
  const button = await queries.getByText(doc, 'Get in touch')
  await button.click()
  await wait(() => queries.getByText(doc, 'How do you want to get in touch?'))
  const contactButton = await queries.queryByText(doc, 'submit tix')
  expect(contactButton).toBeTruthy()
  await page.evaluate(() => zE('webWidget', 'setLocale', 'fr'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'the french')).toBeTruthy()
  })
})

test('override chat online label', async () => {
  await buildWidget()
    .withPresets('chat')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          contactOptions: {
            chatLabelOnline: {
              '*': 'start chat',
              fr: 'french start chat'
            }
          }
        }
      }
    })
    .load()
  await zChat.online()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await waitForGetInTouchButton()
  const doc = await widget.getDocument()
  const button = await queries.getByText(doc, 'Get in touch')
  await button.click()
  await wait(() => queries.getByText(doc, 'How do you want to get in touch?'))
  const contactButton = await queries.queryByText(doc, 'start chat')
  expect(contactButton).toBeTruthy()
  await page.evaluate(() => zE('webWidget', 'setLocale', 'fr'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'french start chat')).toBeTruthy()
  })
})

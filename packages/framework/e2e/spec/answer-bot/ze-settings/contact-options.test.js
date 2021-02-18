import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { waitForAnswerBot, waitForGetInTouchButton } from 'e2e/helpers/answer-bot-embed'
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
              fr: 'the french',
            },
          },
        },
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await waitForGetInTouchButton()
  await widget.clickButton('Get in touch')
  await widget.waitForText('How do you want to get in touch?')
  await widget.expectToSeeText('submit tix')
  await page.evaluate(() => zE('webWidget', 'setLocale', 'fr'))
  await widget.waitForText('the french')
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
              fr: 'french start chat',
            },
          },
        },
      }
    })
    .load()
  await zChat.online()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await waitForGetInTouchButton()
  await widget.clickButton('Get in touch')
  await widget.waitForText('How do you want to get in touch?')
  await widget.expectToSeeText('start chat')
  await page.evaluate(() => zE('webWidget', 'setLocale', 'fr'))
  await widget.waitForText('french start chat')
})

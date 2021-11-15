// import { AxePuppeteer } from '@axe-core/puppeteer'
import { waitForAnswerBot, waitForGetInTouchButton } from 'e2e/helpers/answer-bot-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import zChat from 'e2e/helpers/zChat'

test('clicking chat channel goes to chat embed', async () => {
  await loadWidget('answerBot', 'chat')
  await zChat.online()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  await waitForGetInTouchButton()
  await widget.clickButton('Get in touch')
  await widget.waitForText('How do you want to get in touch?')
  await widget.clickText('Live chat')
  await widget.expectToSeeText('Chat with us')

  /* eslint no-console:0 */
  // const results = await new AxePuppeteer(page).analyze()
  // results.violations.forEach((v) => {
  //   console.log(v)
  //   v.nodes.forEach((n) => console.log(n))
  // })

  await expect(page).toPassAxeTests({
    exclude: ['#webWidget', '#widgetHeaderTitle'],
  })
})

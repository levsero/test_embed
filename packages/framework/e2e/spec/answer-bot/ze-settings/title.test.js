import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'

test('updates the title', async () => {
  await loadWidget()
    .withPresets('answerBot')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            title: {
              '*': 'answer bot title fallback',
              fr: 'french ab title',
            },
          },
        },
      }
    })
    .load()
  await widget.openByKeyboard()
  await widget.waitForText('answer bot title fallback')
  await page.evaluate(() => {
    zE('webWidget', 'setLocale', 'fr')
  })
  await widget.waitForText('french ab title')
})

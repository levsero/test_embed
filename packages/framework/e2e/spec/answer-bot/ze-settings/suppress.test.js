import { waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import { waitForContactForm } from 'e2e/helpers/support-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'

test('shows help center when answer bot is suppressed', async () => {
  await loadWidget()
    .withPresets('answerBot')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            suppress: true,
          },
        },
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForHelpCenter()
})

test('shows other embed when help center and answer bot are both suppressed', async () => {
  await loadWidget()
    .withPresets('answerBot', 'contactForm')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          helpCenter: {
            suppress: true,
          },
          answerBot: {
            suppress: true,
          },
        },
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForContactForm()
})

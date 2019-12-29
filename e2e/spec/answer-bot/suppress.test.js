import { queries, wait } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page/fluent'
import widget from 'e2e/helpers/widget'

test('shows help center when answer bot is suppressed', async () => {
  await loadWidget()
    .withPresets('answerBot')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            suppress: true
          }
        }
      }
    })
    .load()
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByPlaceholderText(doc, 'How can we help?')).toBeTruthy()
  })
})

test('shows other embed when help center and answer bot are both suppressed', async () => {
  await loadWidget()
    .withPresets('answerBot', 'contactForm')
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          helpCenter: {
            suppress: true
          },
          answerBot: {
            suppress: true
          }
        }
      }
    })
    .load()
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByLabelText(doc, 'Your name (optional)')).toBeTruthy()
  })
})

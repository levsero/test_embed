import { queries, wait } from 'pptr-testing-library'
import widgetPage from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'

test('shows help center when answer bot is suppressed', async () => {
  await widgetPage.load({
    mockRequests: [mockEmbeddableConfigEndpoint('answerBot')],
    preload: () => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            suppress: true
          }
        }
      }
    }
  })
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByPlaceholderText(doc, 'How can we help?')).toBeTruthy()
  })
})

test('shows other embed when help center and answer bot are both suppressed', async () => {
  await widgetPage.loadWithConfig('answerBot', 'contactForm')
  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        helpCenter: {
          suppress: true
        },
        answerBot: {
          suppress: true
        }
      }
    })
  })
  await widget.openByKeyboard()
  const doc = await widget.getDocument()
  await wait(async () => {
    expect(await queries.queryByLabelText(doc, 'Your name (optional)')).toBeTruthy()
  })
})

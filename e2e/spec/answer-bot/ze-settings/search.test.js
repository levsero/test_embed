import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { search, waitForAnswerBot, mockInteractionEndpoint } from 'e2e/helpers/answer-bot-embed'
import { queries, wait } from 'pptr-testing-library'
import searchResults from 'e2e/fixtures/responses/answer-bot-interaction.json'
import { getJsonPayload } from 'e2e/helpers/utils'

test('includes labels in query', async () => {
  const endpoint = jest.fn()
  await loadWidget()
    .withPresets('answerBot')
    .intercept(mockInteractionEndpoint(searchResults, endpoint))
    .evaluateOnNewDocument(() => {
      window.zESettings = {
        webWidget: {
          answerBot: {
            search: {
              labels: ['testing', 'I would like help.']
            }
          }
        }
      }
    })
    .load()
  await widget.openByKeyboard()
  await waitForAnswerBot()
  const doc = await widget.getDocument()
  await search('help')
  await page.waitFor(100)
  await wait(() => queries.getByText(doc, 'Here are some articles that may help:'))
  expect(getJsonPayload(endpoint)).toEqual(
    expect.objectContaining({
      enquiry: 'help',
      labels: ['testing', 'I would like help.']
    })
  )
})
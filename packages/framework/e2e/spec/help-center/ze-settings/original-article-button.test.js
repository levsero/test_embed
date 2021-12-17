import {
  assertOriginalArticleLink,
  mockSearchEndpoint,
  waitForHelpCenter,
} from 'e2e/helpers/help-center-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries } from 'pptr-testing-library'

const buildWidget = () =>
  loadWidget().withPresets('helpCenterWithContextualHelp').intercept(mockSearchEndpoint())

test('displays the original article button', async () => {
  await buildWidget().load()

  await widget.openByKeyboard()

  const doc = await widget.getDocument()
  await waitForHelpCenter()
  const title = await queries.getByText(doc, 'Welcome to your Help Center!')
  await title.click()
  await queries.getByText(doc, 'This is the body.')
  await assertOriginalArticleLink(
    'https://answerbot.zendesk.com/hc/en-us/articles/2nd-article?auth_token=eyJ'
  )
  await expect(page).toPassAxeTests()
})

test('hides the original article button via api', async () => {
  await buildWidget().load()
  await page.evaluate(() => {
    zE('webWidget', 'updateSettings', {
      webWidget: {
        helpCenter: {
          originalArticleButton: false,
        },
      },
    })
  })

  await widget.openByKeyboard()

  const doc = await widget.getDocument()
  await waitForHelpCenter()
  const title = await queries.getByText(doc, 'Welcome to your Help Center!')
  await title.click()
  await queries.getByText(doc, 'This is the body.')
  const link = await queries.queryByTitle(doc, 'View original article')
  expect(link).not.toBeTruthy()
  await expect(page).toPassAxeTests()
})

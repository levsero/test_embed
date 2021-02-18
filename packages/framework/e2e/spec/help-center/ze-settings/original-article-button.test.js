import { queries } from 'pptr-testing-library'
import loadWidget from 'e2e/helpers/widget-page'
import widget from 'e2e/helpers/widget'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'

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
  const link = await queries.queryByTitle(doc, 'View original article')
  expect(link).toBeTruthy()
  const href = await link.getProperty('href')
  expect(await href.jsonValue()).toEqual(
    'https://testing.zendesk.com/hc/en-us/articles/115002343711-Welcome-to-your-Help-Center-'
  )
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
})

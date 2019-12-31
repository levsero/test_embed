import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import { queries, wait } from 'pptr-testing-library'

const assertLogoHidden = async () => {
  await launcher.click()
  await waitForHelpCenter()
  expect(await widget.zendeskLogoVisible()).toEqual(false)
  const doc = await widget.getDocument()
  await page.keyboard.type('welcome')
  await page.keyboard.press('Enter')
  await wait(() => queries.getByText(doc, 'Top results'))
  expect(await widget.zendeskLogoVisible()).toEqual(false)
  const title = await queries.getByText(doc, 'Welcome to your Help Center!')
  await title.click()
  await wait(() => queries.getByText(doc, 'This is the body.'))
  expect(await widget.zendeskLogoVisible()).toEqual(false)
}

const buildWidget = () =>
  loadWidget()
    .withPresets('helpCenter', {
      hideZendeskLogo: true
    })
    .intercept(mockSearchEndpoint())

test('hides the zendesk logo in desktop', async () => {
  await buildWidget().load()
  await assertLogoHidden()
})

test('hides the zendesk logo in mobile', async () => {
  await buildWidget()
    .useMobile()
    .load()
  await assertLogoHidden()
})

import { queries, wait } from 'pptr-testing-library'
import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockEmbeddableConfigEndpoint } from 'e2e/helpers/widget-page/embeddable-config'
import { mockSearchEndpoint } from 'e2e/helpers/help-center-embed'
import { waitForHelpCenter } from 'e2e/helpers/utils'

test('searching the help center', async () => {
  await widgetPage.load({
    mockRequests: [mockEmbeddableConfigEndpoint('helpCenter'), mockSearchEndpoint()],
    mobile: true
  })
  await launcher.click()
  await waitForHelpCenter()

  const doc = await widget.getDocument()
  const helpCenterSearchInput = await queries.getByPlaceholderText(doc, 'How can we help?')

  await page.keyboard.type('welcome')
  await wait(async () => {
    const searchFieldValue = await helpCenterSearchInput.getProperty('value')
    expect(await searchFieldValue.jsonValue()).toEqual('welcome')
  })

  page.keyboard.press('Enter')
  await wait(() => queries.getByText(doc, 'Top results'))
  const title = await queries.getByText(doc, 'Welcome to your Help Center!')
  await title.click()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'This is the body.')).toBeTruthy()
  })
})

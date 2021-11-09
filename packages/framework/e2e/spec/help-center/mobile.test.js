import {
  mockSearchEndpoint,
  waitForHelpCenter,
  clickClearInputIcon,
} from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries, wait } from 'pptr-testing-library'

beforeEach(async () => {
  await loadWidget().withPresets('helpCenter').intercept(mockSearchEndpoint()).useMobile().load()

  await launcher.click()
  await waitForHelpCenter()
})

const getInputValue = async () => {
  const doc = await widget.getDocument()
  const helpCenterSearchInput = await queries.getByPlaceholderText(doc, 'How can we help?')
  const searchFieldValue = await helpCenterSearchInput.getProperty('value')
  return searchFieldValue.jsonValue()
}

test('searching the help center', async () => {
  const doc = await widget.getDocument()
  expect(await widget.zendeskLogoVisible()).toEqual(true)

  await page.keyboard.type('welcome')
  await wait(async () => {
    expect(await getInputValue()).toEqual('welcome')
  })

  await page.keyboard.press('Enter')
  await wait(() => queries.getByText(doc, 'Top results'))
  expect(await widget.zendeskLogoVisible()).toEqual(true)
  expect(await queries.queryByText(doc, 'Leave us a message')).not.toBeTruthy()

  const title = await queries.getByText(doc, 'Welcome to your Help Center!')
  await title.click()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'This is the body.')).toBeTruthy()
  })
  // expect the original article button to exist
  expect(await queries.queryByLabelText(doc, 'View original article')).toBeTruthy()
  expect(await widget.zendeskLogoVisible()).toEqual(true)

  await widget.clickBack()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Top results')).toBeTruthy()
  })
})

test('clicking clear icon clears input', async () => {
  await page.keyboard.type('welcome')
  await wait(async () => {
    expect(await getInputValue()).toEqual('welcome')
  })

  await clickClearInputIcon()
  await wait(async () => {
    expect(await getInputValue()).toEqual('')
  })
})

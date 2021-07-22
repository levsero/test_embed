import { mockSearchEndpoint, waitForHelpCenter, search } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries, wait } from 'pptr-testing-library'

const assertInputEmpty = async () => {
  const doc = await widget.getDocument()
  await wait(() => queries.getByPlaceholderText(doc, 'How can we help?'))
  const input = await queries.getByPlaceholderText(doc, 'How can we help?')
  const value = await input.getProperty('value')
  expect(await value.jsonValue()).toEqual('')
}

describe('without contextual help', () => {
  test('resets the widget to pill state', async () => {
    await loadWidget().intercept(mockSearchEndpoint()).withPresets('helpCenter').load()
    await widget.openByKeyboard()
    await waitForHelpCenter()
    await search('hello world')
    await wait(async () => {
      expect(
        await queries.queryByText(await widget.getDocument(), 'Welcome to your Help Center!')
      ).toBeTruthy()
    })
    await widget.clickClose()
    await wait(() => expect(launcher).toBeVisible())
    await page.evaluate(() => zE('webWidget', 'reset'))
    await launcher.click()
    await assertInputEmpty()
    expect(
      await queries.queryByText(await widget.getDocument(), 'Try searching for something else.')
    ).toBeNull()
  })
})

describe('with contextual help', () => {
  test('resets the widget to contextual help state', async () => {
    await loadWidget()
      .intercept(mockSearchEndpoint())
      .withPresets('helpCenterWithContextualHelp')
      .load()
    await widget.openByKeyboard()
    await waitForHelpCenter()
    await search('hello world')
    await widget.clickClose()
    await wait(() => expect(launcher).toBeVisible())
    await page.evaluate(() => zE('webWidget', 'reset'))
    await launcher.click()
    await assertInputEmpty()
    expect(await queries.queryByText(await widget.getDocument(), 'Top suggestions')).toBeTruthy()
  })
})

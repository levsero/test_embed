import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { queries, wait } from 'pptr-testing-library'
import { allowsInputTextEditing } from '../shared-examples'

const buildWidget = (preset = 'helpCenter', options) => loadWidget().withPresets(preset, options)

const getHeight = async (selector) => {
  return await page.evaluate((iframe) => {
    const frame = document.querySelector(iframe)
    return {
      height: frame.style.height,
    }
  }, selector)
}

const assertResults = async () => {
  const doc = await widget.getDocument()
  await wait(() => queries.getByText(doc, 'Top results'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Welcome to your Help Center!')).toBeTruthy()
  })
  expect(await widget.zendeskLogoVisible()).toEqual(true)
  expect(await queries.queryByText(doc, 'Leave us a message')).not.toBeTruthy()
}

test('searching the help center', async () => {
  await buildWidget().intercept(mockSearchEndpoint()).load()
  await launcher.click()

  await waitForHelpCenter()
  const doc = await widget.getDocument()
  const helpCenterSearchInput = await queries.getByPlaceholderText(doc, 'How can we help?')
  expect(await widget.zendeskLogoVisible()).toEqual(true)

  await page.keyboard.type('welcome')
  await wait(async () => {
    const searchFieldValue = await helpCenterSearchInput.getProperty('value')
    expect(await searchFieldValue.jsonValue()).toEqual('welcome')
  })

  await page.keyboard.press('Enter')
  await assertResults()
  const title = await queries.getByText(doc, 'Welcome to your Help Center!')
  await title.click()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'This is the body.')).toBeTruthy()
  })

  expect(await queries.queryByTestId(doc, 'Icon--link-external')).toBeTruthy()
  expect(await widget.zendeskLogoVisible()).toEqual(true)

  await widget.clickBack()
  await assertResults()
})

test('allows the user to edit input text', async () => {
  await buildWidget().load()
  await launcher.click()
  await waitForHelpCenter()
  const doc = await widget.getDocument()
  const inputField = await queries.getByPlaceholderText(doc, 'How can we help?')
  await allowsInputTextEditing(inputField)
})

test('sizes the frame correctly when the logo is visible', async () => {
  await buildWidget().load()
  await launcher.click()
  await waitForHelpCenter()

  await wait(async () => {
    expect(await getHeight(widget.selector)).toEqual({
      height: '172px',
    })
  })
})

test('sizes the frame correctly when the logo is not visible', async () => {
  await buildWidget('helpCenter', { hideZendeskLogo: true }).load()
  await launcher.click()
  await waitForHelpCenter()

  await wait(async () => {
    expect(await getHeight(widget.selector)).toEqual({
      height: '157px',
    })
  })
})

test('sizes the frame correctly for contextual help i.e. full size widget', async () => {
  await buildWidget('helpCenterWithContextualHelp').intercept(mockSearchEndpoint()).load()
  await widget.openByKeyboard()
  await waitForHelpCenter()

  await wait(async () => {
    expect(await getHeight(widget.selector)).toEqual({
      height: '572px',
    })
  })
})

import { queries, wait } from 'pptr-testing-library'
import { allowsInputTextEditing } from '../shared-examples'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'
import { mockSearchEndpoint, waitForHelpCenter } from 'e2e/helpers/help-center-embed'

const buildWidget = () => loadWidget().withPresets('helpCenter')

test('searching the help center', async () => {
  await buildWidget()
    .intercept(mockSearchEndpoint())
    .load()
  await launcher.click()

  await waitForHelpCenter()
  const doc = await widget.getDocument()
  const helpCenterSearchInput = await queries.getByPlaceholderText(doc, 'How can we help?')

  await page.keyboard.type('welcome')
  await wait(async () => {
    const searchFieldValue = await helpCenterSearchInput.getProperty('value')
    expect(await searchFieldValue.jsonValue()).toEqual('welcome')
  })

  await page.keyboard.press('Enter')
  await wait(() => queries.getByText(doc, 'Top results'))
  await wait(async () => {
    expect(await queries.queryByText(doc, 'Welcome to your Help Center!')).toBeTruthy()
  })
  const title = await queries.getByText(doc, 'Welcome to your Help Center!')
  await title.click()
  await wait(async () => {
    expect(await queries.queryByText(doc, 'This is the body.')).toBeTruthy()
  })
})

test('allows the user to edit input text', async () => {
  await buildWidget().load()
  await launcher.click()
  await waitForHelpCenter()
  const doc = await widget.getDocument()
  const inputField = await queries.getByPlaceholderText(doc, 'How can we help?')
  await allowsInputTextEditing(inputField)
})

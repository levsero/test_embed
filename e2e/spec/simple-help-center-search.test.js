import { queries, wait } from 'pptr-testing-library'
import WidgetHelper from '../helpers/widgetHelper'
import { loadPageWithWidget } from '../helpers/utils'
import { TEST_IDS } from '../../src/constants/shared'
import { allowsInputTextEditing } from './shared-examples'

beforeEach(async () => await loadPageWithWidget())

describe('Help center smoke test', () => {
  let widgetHelper, widget

  beforeEach(async () => {
    widgetHelper = new WidgetHelper(page)
    widget = await widgetHelper.getDocumentHandle(widgetHelper.widgetFrame)

    await widgetHelper.clickLauncherPill()
  })

  it('searches the help center', async () => {
    const helpCenterSearchInput = await queries.getByPlaceholderText(widget, 'How can we help?')

    await page.keyboard.type('welcome')
    await wait(async () => {
      const searchFieldValue = await helpCenterSearchInput.getProperty('value')
      expect(await searchFieldValue.jsonValue()).toBe('welcome')
    })

    page.keyboard.press('Enter')
    await wait(() => queries.getByText(widget, 'Top results'))
    await wait(async () => {
      expect(await queries.queryByText(widget, 'Welcome to your Help Center!')).toBeTruthy()
    })
  })

  it('allows the user to edit input text', async () => {
    allowsInputTextEditing(widgetHelper, widget, TEST_IDS.SEARCH_FIELD)
  })
})

import { queries, wait } from 'pptr-testing-library'
import { TEST_IDS } from 'src/constants/shared'
import { allowsInputTextEditing } from './shared-examples'
import widgetPage from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import widget from 'e2e/helpers/widget'

describe('Help center smoke test', () => {
  beforeEach(async () => {
    await widgetPage.loadWithConfig('helpCenter')
    await launcher.click()
  })

  it('searches the help center', async () => {
    const helpCenterSearchInput = await queries.getByPlaceholderText(
      await widget.getDocument(),
      'How can we help?'
    )

    await page.keyboard.type('welcome')
    await wait(async () => {
      const searchFieldValue = await helpCenterSearchInput.getProperty('value')
      expect(await searchFieldValue.jsonValue()).toEqual('welcome')
    })

    page.keyboard.press('Enter')
    await wait(async () => queries.getByText(await widget.getDocument(), 'Top results'))
    await wait(async () => {
      expect(
        await queries.queryByText(await widget.getDocument(), 'Welcome to your Help Center!')
      ).toBeTruthy()
    })
  })

  it('allows the user to edit input text', async () => {
    const inputField = await queries.getByTestId(await widget.getDocument(), TEST_IDS.SEARCH_FIELD)
    await allowsInputTextEditing(inputField)
  })
})

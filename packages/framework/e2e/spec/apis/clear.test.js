import { testForm } from '../../helpers/support-embed'
import { queries } from 'pptr-testing-library'
import widget from '../../helpers/widget'
import launcher from 'e2e/helpers/launcher'
import { allowsInputTextEditing } from '../shared-examples'
import { assertInputValue } from '../../helpers/utils'

describe('support embed', () => {
  beforeEach(async () => {
    await testForm({ config: {} })

    const descriptionElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'How can we help you?'
    )
    await allowsInputTextEditing(descriptionElement, 'Some message')
    await assertInputValue('How can we help you?', 'Some message')
  })

  test('clears support form fields while widget is open', async () => {
    await page.evaluate(() => {
      zE('webWidget', 'clear')
    })

    await assertInputValue('How can we help you?', '')
  })

  test('clears support form fields while widget is closed', async () => {
    await widget.clickClose()

    await page.evaluate(() => {
      zE('webWidget', 'clear')
    })

    await launcher.click()

    await assertInputValue('How can we help you?', '')
  })
})

import { testForm } from '../../helpers/support-embed'
import { queries } from 'pptr-testing-library'
import widget from '../../helpers/widget'
import { allowsInputTextEditing } from '../shared-examples'
import { assertInputValue } from '../../helpers/utils'
import launcher from '../../helpers/launcher'

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

  test('does not reset form while the widget is open', async () => {
    await page.evaluate(() => {
      zE('webWidget', 'reset')
    })

    await assertInputValue('How can we help you?', 'Some message')
  })

  test('resets form while widget is closed', async () => {
    await widget.clickClose()

    await page.evaluate(() => {
      zE('webWidget', 'reset')
    })

    await launcher.click()

    await assertInputValue('How can we help you?', '')
  })

  test('resets prefill values while widget is closed', async () => {
    await page.evaluate(() => {
      zE('webWidget', 'prefill', {
        email: {
          value: 'example@example.com'
        }
      })
    })

    await assertInputValue('Email address', 'example@example.com')

    await widget.clickClose()

    await page.evaluate(() => {
      zE('webWidget', 'reset')
    })

    await launcher.click()

    await assertInputValue('Email address', '')
  })
})

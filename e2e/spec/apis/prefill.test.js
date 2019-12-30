import { wait, queries } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import launcher from 'e2e/helpers/launcher'
import { assertInputValue } from 'e2e/helpers/utils'

const buildWidget = () => {
  return loadWidget().withPresets('contactForm')
}

test('prefills the contact form', async () => {
  await buildWidget()
    .evaluateOnNewDocument(() => {
      zE('webWidget', 'prefill', {
        name: { value: 'isamu' },
        email: { value: 'isamu@voltron.com' },
        phone: { value: '61431909749' }
      })
    })
    .load()
  await launcher.click()
  const doc = await widget.getDocument()
  await wait(() => queries.getByText(doc, 'Leave us a message'))
  await assertInputValue('Your name (optional)', 'isamu')
  await assertInputValue('Email address', 'isamu@voltron.com')
})

const assertReadOnly = async (doc, label) => {
  const input = await queries.getByLabelText(doc, label)
  const roHandle = await input.getProperty('readOnly')
  await expect(await roHandle.jsonValue()).toEqual(true)
}

test('prefills the contact form and sets it as read only', async () => {
  await buildWidget()
    .evaluateOnNewDocument(() => {
      zE('webWidget', 'prefill', {
        name: { value: 'isamu', readOnly: true },
        email: { value: 'isamu@voltron.com', readOnly: true }
      })
    })
    .load()
  await launcher.click()
  const doc = await widget.getDocument()
  await wait(() => queries.getByText(doc, 'Leave us a message'))
  await assertInputValue('Your name', 'isamu')
  await assertInputValue('Email address', 'isamu@voltron.com')
  await assertReadOnly(doc, 'Your name')
  await assertReadOnly(doc, 'Email address')
})

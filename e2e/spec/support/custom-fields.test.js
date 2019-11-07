import { queries } from 'pptr-testing-library'
import { createField, createForm, testForm } from 'e2e/helpers/support-embed'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import widget from 'e2e/helpers/widget'

const testCustomForm = async ({ field, ...other }) => {
  // Add a description field to each custom form we are testing, this is because our code will fail if
  // a description field is not included.
  const descriptionField = createField({ type: 'description' })

  const { mockFormsResponse, embedConfig, form } = createForm(
    'Example form',
    field,
    descriptionField
  )

  const result = await testForm({
    mockFormsResponse,
    ...other,
    config: {
      attachmentsEnabled: false,
      nameEnabled: false,
      ...embedConfig
    }
  })

  const descriptionElement = await queries.queryByLabelText(
    await widget.getDocument(),
    descriptionField.title_in_portal
  )

  await allowsInputTextEditing(descriptionElement, 'Some message')

  const element = await queries.queryByLabelText(await widget.getDocument(), field.title_in_portal)

  return {
    ...result,
    element,

    // override the expectSuccess function so each test doesn't have to worry about the extra
    // description field
    expectSuccess: (values = {}) => {
      return result.expectSuccess(form.id, {
        description: 'Some message',
        ...values
      })
    }
  }
}

describe('support custom fields', () => {
  describe('checkbox', () => {
    test('checked', async () => {
      const checkbox = createField({ type: 'checkbox' })

      const { expectSuccess, element } = await testCustomForm({
        field: checkbox
      })

      await element.click()

      await expectSuccess({
        [checkbox.id]: 1
      })
    })

    test('unchecked when not required', async () => {
      const checkbox = createField({ type: 'checkbox', required_in_portal: false })

      const { expectSuccess } = await testCustomForm({
        field: checkbox
      })

      await expectSuccess({
        [checkbox.id]: 0
      })
    })

    test('unchecked when required', async () => {
      const checkbox = createField({ type: 'checkbox', required_in_portal: true })

      const { submit, expectSuccess, element } = await testCustomForm({
        field: checkbox
      })

      await submit()

      const widgetDocument = await widget.getDocument()
      await expect(await widgetDocument.$('body')).toMatch('Please check this box to proceed.')

      await element.click()
      await expectSuccess({
        [checkbox.id]: 1
      })
    })
  })

  describe('text', () => {
    test('text entered', async () => {
      const field = createField({ type: 'text' })

      const { expectSuccess, element } = await testCustomForm({ field })

      await allowsInputTextEditing(element, 'Some text')
      await expectSuccess({
        [field.id]: 'Some text'
      })
    })

    test('text not entered but not required', async () => {
      const field = createField({ type: 'text', required_in_portal: false })

      const { expectSuccess } = await testCustomForm({ field })

      await expectSuccess({
        [field.id]: ''
      })
    })

    test('text not entered but required', async () => {
      const field = createField({ type: 'text', required_in_portal: true })

      const { submit, expectSuccess, element } = await testCustomForm({ field })

      await submit()

      const widgetDocument = await widget.getDocument()
      await expect(await widgetDocument.$('body')).toMatch('Please enter a value.')

      await allowsInputTextEditing(element, 'Some text')
      await expectSuccess({
        [field.id]: 'Some text'
      })
    })
  })

  describe('textarea', () => {
    test('text entered', async () => {
      const field = createField({ type: 'textarea' })

      const { expectSuccess, element } = await testCustomForm({ field })

      await allowsInputTextEditing(element, 'Some text')
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.keyboard.type('More text')

      await expectSuccess({
        [field.id]: 'Some text\n\nMore text'
      })
    })

    test('text not entered but not required', async () => {
      const field = createField({ type: 'textarea', required_in_portal: false })

      const { expectSuccess } = await testCustomForm({ field })

      await expectSuccess({
        [field.id]: ''
      })
    })

    test('text not entered but required', async () => {
      const field = createField({ type: 'textarea', required_in_portal: true })

      const { submit, expectSuccess, element } = await testCustomForm({ field })

      await submit()

      const widgetDocument = await widget.getDocument()
      await expect(await widgetDocument.$('body')).toMatch('Please enter a value.')

      await allowsInputTextEditing(element, 'Some text')
      await page.keyboard.press('Enter')
      await page.keyboard.press('Enter')
      await page.keyboard.type('More text')

      await expectSuccess({
        [field.id]: 'Some text\n\nMore text'
      })
    })
  })

  describe('integer', () => {
    test('number entered', async () => {
      const field = createField({ type: 'integer' })

      const { expectSuccess, element } = await testCustomForm({ field })

      await element.focus()
      await page.keyboard.type('123')

      await expectSuccess({
        [field.id]: '123'
      })
    })

    test('number not entered but not required', async () => {
      const field = createField({ type: 'integer', required_in_portal: false })

      const { expectSuccess } = await testCustomForm({ field })

      await expectSuccess({
        [field.id]: ''
      })
    })

    test('number not entered required', async () => {
      const field = createField({ type: 'integer', required_in_portal: true })

      const { submit, expectSuccess, element } = await testCustomForm({ field })

      await submit()

      const widgetDocument = await widget.getDocument()
      await expect(await widgetDocument.$('body')).toMatch('Please enter a number.')

      await element.focus()
      await page.keyboard.type('123')
      await expectSuccess({
        [field.id]: '123'
      })
    })
  })

  describe('decimal', () => {
    test('decimal entered', async () => {
      const field = createField({ type: 'decimal' })

      const { expectSuccess, element } = await testCustomForm({ field })

      await element.focus()
      await page.keyboard.type('123.456')

      await expectSuccess({
        [field.id]: '123.456'
      })
    })

    test('decimal not entered but not required', async () => {
      const field = createField({
        type: 'decimal',
        required_in_portal: false
      })

      const { expectSuccess } = await testCustomForm({ field })

      await expectSuccess({
        [field.id]: ''
      })
    })

    test('decimal not entered required', async () => {
      const field = createField({
        type: 'decimal',
        required_in_portal: true
      })

      const { submit, expectSuccess, element } = await testCustomForm({ field })

      await submit()

      const widgetDocument = await widget.getDocument()
      await expect(await widgetDocument.$('body')).toMatch('Please enter a number.')

      await element.focus()
      await page.keyboard.type('123.456')
      await expectSuccess({
        [field.id]: '123.456'
      })
    })
  })
})

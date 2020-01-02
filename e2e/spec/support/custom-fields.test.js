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
    123,
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

  describe('tagger', () => {
    const openDropdown = async () => {
      const doc = await widget.getDocument()
      const dropdown = await queries.getByTestId(doc, 'dropdown-field')
      await dropdown.click()
    }

    const select = async option => {
      const doc = await widget.getDocument()
      const item = await queries.getByText(doc, option)
      await item.click()
    }

    describe('simple dropdown', () => {
      const customFieldOptions = [
        {
          id: 64426144,
          name: 'Sales',
          raw_name: 'Sales',
          value: 'one',
          default: false
        },
        {
          id: 64426154,
          name: 'support',
          raw_name: 'support',
          value: 'two',
          default: true
        },
        {
          id: 63810110,
          name: 'Test',
          raw_name: 'Test',
          value: 'test',
          default: false
        }
      ]

      test('option selected', async () => {
        const field = createField({
          type: 'tagger',
          custom_field_options: customFieldOptions
        })
        const { expectSuccess } = await testCustomForm({ field })
        await openDropdown()
        await select('Sales')
        await expectSuccess({
          [field.id]: 'one'
        })
      })

      test('default', async () => {
        const field = createField({
          type: 'tagger',
          custom_field_options: customFieldOptions
        })
        const { expectSuccess } = await testCustomForm({ field })
        await expectSuccess({
          [field.id]: 'two'
        })
      })

      test('allows empty selection when not required', async () => {
        const field = createField({
          type: 'tagger',
          required_in_portal: false,
          custom_field_options: customFieldOptions
        })
        const { expectSuccess } = await testCustomForm({ field })
        await openDropdown()
        await select('-')
        await expectSuccess({
          [field.id]: ''
        })
      })

      // TODO: Fix the bug this test is testing
      // This test should be enabled once this bug is fixed
      test.skip('required but not selected', async () => {
        const field = createField({
          type: 'tagger',
          required_in_portal: true,
          custom_field_options: [customFieldOptions[0], customFieldOptions[2]]
        })
        const { expectSuccess, submit } = await testCustomForm({ field })
        await submit()

        const doc = await widget.getDocument()
        await expect(await doc.$('body')).toMatch('Please enter a value.')

        await openDropdown()
        await select('Sales')
        await expectSuccess({
          [field.id]: 'one'
        })
      })
    })

    describe('nested dropdown', () => {
      const customFieldOptions = [
        {
          id: 66706606,
          name: 'what::happens::when::I::do::something::stupid::like::this',
          raw_name: 'what::happens::when::I::do::something::stupid::like::this',
          value: 'what__happens__when__i__do__something__stupid__like__this',
          default: false
        }
      ]

      test('selects nested option', async () => {
        const field = createField({
          type: 'tagger',
          custom_field_options: customFieldOptions
        })
        const { expectSuccess } = await testCustomForm({ field })
        await openDropdown()
        await select('what')
        await select('happens')
        await select('when')
        await select('I')
        await select('do')
        await select('something')
        await select('stupid')
        await select('like')
        await select('this')
        await expectSuccess({
          [field.id]: 'what__happens__when__i__do__something__stupid__like__this'
        })
      })

      test('navigates to previous', async () => {
        const field = createField({
          type: 'tagger',
          custom_field_options: customFieldOptions
        })
        const { expectSuccess } = await testCustomForm({ field })
        await openDropdown()
        await select('what')
        await select('happens')
        await select('when')
        await select('when')
        await select('happens')
        await select('what')
        await expectSuccess({
          [field.id]: ''
        })
      })
    })
  })
})

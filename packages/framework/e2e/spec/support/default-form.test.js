import { queryAllByText } from 'e2e/helpers/queries'
import {
  createField,
  mockTicketFieldsEndpoint,
  testForm,
  waitForContactForm,
} from 'e2e/helpers/support-embed'
import widget from 'e2e/helpers/widget'
import loadWidget from 'e2e/helpers/widget-page'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import { queries, wait } from 'pptr-testing-library'

const testDefaultForm = async ({ config }) => {
  const form = await testForm({ config })

  const descriptionElement = await queries.queryByLabelText(
    await widget.getDocument(),
    'How can we help you?'
  )
  await allowsInputTextEditing(descriptionElement, 'Some message')

  return {
    ...form,
    expectSuccess: (values = {}) => {
      return form.expectSuccess(null, {
        description: 'Some message',
        ...values,
      })
    },
  }
}

describe('support default form', () => {
  describe('name field', () => {
    test('when name is not enabled', async () => {
      const { expectSuccess } = await testDefaultForm({
        config: {
          nameFieldEnabled: false,
          attachmentsEnabled: false,
        },
      })

      await expect(
        await queryAllByText(['Email address', 'How can we help you?'])
      ).toAppearInOrder()

      await expect(await queries.queryByText(await widget.getDocument(), 'Your name')).toBeNull()

      await expectSuccess({
        name: 'Fake',
      })
    })

    test('when name is enabled but not required', async () => {
      const { expectSuccess } = await testDefaultForm({
        config: {
          nameFieldEnabled: true,
          nameFieldRequired: false,
          attachmentsEnabled: false,
        },
      })

      await expect(
        await queryAllByText(['Your name', 'Email address', 'How can we help you?'])
      ).toAppearInOrder()

      await expect(await queries.queryByText(await widget.getDocument(), 'Your name')).toBeTruthy()

      await expectSuccess({
        name: 'Fake',
      })
    })

    test('when name is enabled and required', async () => {
      const { submit, expectSuccess } = await testDefaultForm({
        config: {
          nameFieldEnabled: true,
          nameFieldRequired: true,
          attachmentsEnabled: false,
        },
      })

      const nameElement = await queries.queryByLabelText(await widget.getDocument(), 'Your name')

      await submit()

      await wait(async () =>
        queries.getByText(await widget.getDocument(), 'Please enter a valid name.')
      )

      await allowsInputTextEditing(nameElement, 'Some person')

      await expect(
        await queryAllByText(['Your name', 'Email address', 'How can we help you?'])
      ).toAppearInOrder()

      await expectSuccess({
        name: 'Some person',
      })
    })
  })

  describe('attachments field', () => {
    test('when enabled', async () => {
      await testDefaultForm({
        config: {
          nameFieldEnabled: false,
          attachmentsEnabled: true,
        },
      })

      await expect(
        await queryAllByText(['Email address', 'How can we help you?', 'Attachments'])
      ).toAppearInOrder()
    })

    test('when disabled', async () => {
      await testDefaultForm({
        config: {
          nameFieldEnabled: false,
          attachmentsEnabled: false,
        },
      })

      await expect(
        await queryAllByText(['Email address', 'How can we help you?'])
      ).toAppearInOrder()

      await expect(await queries.queryByText(await widget.getDocument(), 'Attachments')).toBeNull()
    })
  })

  describe('when there are custom fields in embeddable config', () => {
    it('displays the fields in the correct order', async () => {
      const checkbox1 = createField({ type: 'checkbox' })
      const checkbox2 = createField({ type: 'checkbox' })

      const ticketFields = [checkbox1, checkbox2]
      await loadWidget()
        .intercept(mockTicketFieldsEndpoint(ticketFields))
        .withPresets('contactForm', {
          embeds: {
            ticketSubmissionForm: {
              props: {
                customFields: { ids: ticketFields.map((form) => form.id) },
              },
            },
          },
        })
        .load()

      await widget.openByKeyboard()

      await waitForContactForm()
      await expect(
        await queryAllByText([
          'Your name',
          'Email address',
          'How can we help you?',
          checkbox1.title_in_portal,
          checkbox2.title_in_portal,
          'Attachments',
        ])
      ).toAppearInOrder()
    })
  })
})

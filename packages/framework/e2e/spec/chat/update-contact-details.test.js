import {
  loadWidgetWithChatOnline,
  clickStartChat,
  waitForChatToBeReady,
  clickChatOptions,
} from 'e2e/helpers/chat-embed'
import { clearInputField } from 'e2e/helpers/utils'
import widget from 'e2e/helpers/widget'
import zChat from 'e2e/helpers/zChat'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import { queries } from 'pptr-testing-library'

const setupTest = async () => {
  await loadWidgetWithChatOnline()
  await zChat.setVisitorInfo()
  await clickStartChat()
  await waitForChatToBeReady()
  await clickChatOptions()
  await widget.clickText('Edit contact details')
  await widget.waitForText('Save')

  const nameField = await queries.getByLabelText(await widget.getDocument(), 'Name (optional)')
  const emailField = await queries.getByLabelText(await widget.getDocument(), 'Email (optional)')

  return { nameField, emailField }
}

test('the user can update their details', async () => {
  const successText = 'Contact details updated'
  const { nameField, emailField } = await setupTest()

  await clearInputField(nameField)
  await clearInputField(emailField)

  await allowsInputTextEditing(nameField, 'Hugh Mann')
  await allowsInputTextEditing(emailField, 'nope_rope@example.com')

  await widget.clickButton('Save')
  await widget.waitForText(successText)

  await widget.expectToSeeText(successText)
})

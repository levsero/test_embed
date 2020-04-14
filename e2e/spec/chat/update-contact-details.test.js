import { queries } from 'pptr-testing-library'

import widget from 'e2e/helpers/widget'
import {
  loadWidgetWithChatOnline,
  clickStartChat,
  waitForChatToBeReady,
  clickChatOptions
} from 'e2e/helpers/chat-embed'
import zChat from 'e2e/helpers/zChat'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import { clearInputField } from 'e2e/helpers/utils'
import { TEST_IDS } from 'src/constants/shared'

const clickEditContactDetails = async () => {
  const editDetails = await queries.getByTestId(
    await widget.getDocument(),
    TEST_IDS.CHAT_MENU_ITEM_EDIT_CONTACT_DETAILS
  )

  await editDetails.click()
}

const setupTest = async () => {
  await loadWidgetWithChatOnline()
  await zChat.setVisitorInfo()
  await clickStartChat()
  await waitForChatToBeReady()
  await clickChatOptions()
  await clickEditContactDetails()

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

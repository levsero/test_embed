import {
  clickStartChat,
  loadWidgetWithChatOnline,
  waitForChatToBeReady
} from 'e2e/helpers/chat-embed'
import { queries } from 'pptr-testing-library'
import widget from 'e2e/helpers/widget'
import { allowsInputTextEditing } from 'e2e/spec/shared-examples'
import { assertInputValue, clearInputField } from 'e2e/helpers/utils'
import zChat from 'e2e/helpers/zChat'

describe('prechat form', () => {
  test('submit prechat form', async () => {
    await loadWidgetWithChatOnline()

    const nameElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'Name (optional)'
    )
    await clearInputField(nameElement)
    await allowsInputTextEditing(nameElement, 'Some name')

    const emailElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'Email (optional)'
    )
    await allowsInputTextEditing(emailElement, 'example@example.com')

    const messageElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'Message (optional)'
    )
    await allowsInputTextEditing(messageElement, 'Some message')

    await clickStartChat()
    await waitForChatToBeReady()

    await widget.expectToSeeText('Some message')

    const chatMenu = await queries.queryByTestId(await widget.getDocument(), 'chat-menu')
    await chatMenu.click()

    await widget.clickText('Edit contact details')

    await assertInputValue('Name (optional)', 'Some name')
    await assertInputValue('Email (optional)', 'example@example.com')
  })

  test('submit prechat form with department selected', async () => {
    await loadWidgetWithChatOnline()
    await zChat.setVisitorDefaultDepartment()

    await zChat.updateDepartment({ status: 'online', id: 1, name: 'Department 1' })
    await zChat.updateDepartment({ status: 'online', id: 2, name: 'Department 2' })

    await widget.clickText('Choose a department')
    await widget.clickText('Department 1')

    const messageElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'Message (optional)'
    )
    await allowsInputTextEditing(messageElement, 'Some message')

    await clickStartChat()

    await waitForChatToBeReady()

    await zChat.expectCurrentDepartmentToBe(1)
    await widget.expectToSeeText('Some message')
  })

  test('sends online message if department field is hidden', async () => {
    await loadWidgetWithChatOnline()
    await zChat.clearVisitorDefaultDepartment()
    await zChat.setVisitorDefaultDepartment()

    await zChat.updateDepartment({ status: 'online', id: 1, name: 'Department 1' })
    await zChat.updateDepartment({ status: 'offline', id: 2, name: 'Department 2' })

    await page.evaluate(() => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          chat: {
            departments: {
              enabled: []
            }
          }
        }
      })
    })

    const messageElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'Message (optional)'
    )
    await allowsInputTextEditing(messageElement, 'Some message')

    await clickStartChat()

    await waitForChatToBeReady()

    await widget.expectToSeeText('Some message')
  })

  test('submits offline message if offline department is selected', async () => {
    await loadWidgetWithChatOnline()

    await zChat.clearVisitorDefaultDepartment()
    await zChat.setVisitorDefaultDepartment()
    await zChat.sendOfflineMsg()

    await zChat.updateDepartment({ status: 'offline', id: 1, name: 'Department 1' })
    await zChat.updateDepartment({ status: 'offline', id: 2, name: 'Department 2' })

    await page.evaluate(() => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          chat: {
            departments: {
              select: ['Department 1']
            }
          }
        }
      })
    })

    const nameElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'Name (optional)'
    )
    await clearInputField(nameElement)
    await allowsInputTextEditing(nameElement, 'Some name')

    const emailElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'Email (optional)'
    )
    await allowsInputTextEditing(emailElement, 'example@example.com')

    const messageElement = await queries.queryByLabelText(
      await widget.getDocument(),
      'Message (optional)'
    )
    await allowsInputTextEditing(messageElement, 'Some message')

    await widget.clickButton('Send message')

    await widget.waitForText('Go Back')

    await zChat.expectOfflineFormSubmissionToBe(
      expect.objectContaining({
        name: 'Some name',
        email: 'example@example.com',
        message: 'Some message',
        department: 1
      })
    )
  })
})

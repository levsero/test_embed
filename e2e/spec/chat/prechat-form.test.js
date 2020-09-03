import {
  clickStartChat,
  loadWidgetWithChatOnline,
  waitForChatToBeReady
} from '../../helpers/chat-embed'
import { queries } from 'pptr-testing-library'
import widget from '../../helpers/widget'
import { allowsInputTextEditing } from '../shared-examples'
import { assertInputValue, clearInputField } from '../../helpers/utils'
import zChat from '../../helpers/zChat'

const populateField = async (fieldLabel, value) => {
  const element = await queries.queryByLabelText(await widget.getDocument(), fieldLabel)

  await clearInputField(element)
  await allowsInputTextEditing(element, value)
}

describe('prechat form', () => {
  test('submit prechat form', async () => {
    await loadWidgetWithChatOnline()

    await populateField('Name (optional)', 'Some name')
    await populateField('Email (optional)', 'example@example.com')
    await populateField('Message (optional)', 'Some message')

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

    await populateField('Message (optional)', 'Some message')

    const departmentDropdown = await queries.queryByPlaceholderText(
      await widget.getDocument(),
      'Choose a department'
    )
    await departmentDropdown.click()
    await widget.expectToSeeText('Department 1')
    await widget.expectToSeeText('Department 2')

    await widget.clickText('Department 1')

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

    await populateField('Message (optional)', 'Some message')

    await clickStartChat()

    await waitForChatToBeReady()

    await widget.expectToSeeText('Some message')
  })

  test('submits offline message if offline department is selected', async () => {
    await loadWidgetWithChatOnline()

    await zChat.clearVisitorDefaultDepartment()
    await zChat.setVisitorDefaultDepartment()
    await zChat.sendOfflineMsg()

    await zChat.updateDepartment({ status: 'offline', id: 1, name: 'offline department' })

    await page.evaluate(() => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          chat: {
            departments: {
              select: ['offline department']
            }
          }
        }
      })
    })

    await populateField('Name', 'Some name')
    await populateField('Email', 'example@example.com')
    await populateField('Message', 'Some message')

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

  test('set name field to required if offline department is selected', async () => {
    await loadWidgetWithChatOnline()
    await zChat.clearVisitorDefaultDepartment()
    await zChat.setVisitorDefaultDepartment()
    await zChat.sendOfflineMsg()
    await zChat.updateDepartment({ status: 'offline', id: 1, name: 'Offline department' })

    await page.evaluate(() => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          chat: {
            departments: {
              select: ['Offline department']
            }
          }
        }
      })
    })

    await populateField('Name', '')
    await populateField('Email', 'example@example.com')
    await populateField('Message', 'Some message')

    await widget.clickButton('Send message')

    await widget.expectToSeeText('Please enter a valid name.')
  })

  test('set email field to required if offline department is selected', async () => {
    await loadWidgetWithChatOnline()
    await zChat.clearVisitorDefaultDepartment()
    await zChat.setVisitorDefaultDepartment()
    await zChat.sendOfflineMsg()
    await zChat.updateDepartment({ status: 'offline', id: 1, name: 'Offline department' })

    await page.evaluate(() => {
      zE('webWidget', 'updateSettings', {
        webWidget: {
          chat: {
            departments: {
              select: ['Offline department']
            }
          }
        }
      })
    })

    await populateField('Name', 'Some name')
    await populateField('Email', '')
    await populateField('Message', 'Some message')

    await widget.clickButton('Send message')

    await widget.waitForText('Please enter a valid email address.')
  })
})

/* eslint-disable no-console */
import { waitFor } from '@testing-library/dom'
import { CONNECTION_STATUSES } from 'src/constants/chat'
import errorTracker from 'src/framework/services/errorTracker'
import createStore from 'src/redux/createStore'
import {
  SDK_CONNECTION_UPDATE,
  SDK_DEPARTMENT_UPDATE,
} from 'src/redux/modules/chat/chat-action-types'
import { updateSettings } from 'src/redux/modules/settings'
import verifyDepartmentSettingsUsage from '../verifyDepartmentsSettingUsage'

jest.mock('src/framework/services/errorTracker')

describe('verifyDepartmentsSettingUsage', () => {
  const defaultRealDepartments = [
    { name: 'Department one', status: 'offline', id: 1 },
    { name: 'Department two', status: 'online', id: 2 },
  ]

  const runScenario = ({
    enabledDepartments = [],
    realDepartments = defaultRealDepartments,
    connectChat = true,
  }) => {
    const reduxStore = createStore()
    jest.spyOn(console, 'warn')

    verifyDepartmentSettingsUsage(reduxStore)

    if (connectChat) {
      reduxStore.dispatch({
        type: SDK_CONNECTION_UPDATE,
        payload: { detail: CONNECTION_STATUSES.CONNECTED },
      })
    }

    realDepartments.forEach((department) => {
      reduxStore.dispatch({
        type: SDK_DEPARTMENT_UPDATE,
        payload: {
          detail: department,
          isLastChatRatingEnabled: false,
          timestamp: Date.now(),
          type: 'department_update',
        },
      })
    })

    reduxStore.dispatch(
      updateSettings({
        webWidget: {
          chat: {
            departments: {
              enabled: enabledDepartments,
            },
          },
        },
      })
    )

    return {
      reduxStore,
    }
  }

  it('logs a warning when all departments are invalid', async () => {
    jest.spyOn(console, 'warn')

    runScenario({
      enabledDepartments: ['Invalid department 1', 'Invalid department 1'],
      realDepartments: [
        { name: 'Department one', status: 'offline', id: 1 },
        { name: 'Department two', status: 'online', id: 2 },
      ],
    })

    await waitFor(() =>
      expect(console.warn).toHaveBeenCalledWith(
        `\nA note from Zendesk: Your usage of the Web Widget zESetting webWidget.chat.departments.enabled may result in your Web Widget not being displayed.` +
          `\nYou have configured Chat to only be enabled when specific departments are online. However, these departments either aren't enabled for your Web Widget or don't exist.` +
          `\n\nwebWidget.chat.departments.enabled = ["Invalid department 1","Invalid department 1"]\n` +
          `\nPlease verify your usage of this zESetting and confirm it contains the correct departments you want to use for your Web Widget.` +
          `\nFor more information, see https://developer.zendesk.com/api-reference/widget/settings/#departmentsenabled`
      )
    )
  })

  it('logs a warning when at least one department is invalid', async () => {
    jest.spyOn(console, 'warn')

    runScenario({
      enabledDepartments: ['Department One', 'Invalid department 1'],
    })

    await waitFor(() =>
      expect(console.warn).toHaveBeenCalledWith(
        `Unknown department(s) ["Invalid department 1"] provided to zESetting webWidget.chat.departments.enabled.`
      )
    )
  })

  it('only logs an error in Rollbar once', async () => {
    jest.spyOn(console, 'warn')

    const { reduxStore } = runScenario({
      enabledDepartments: ['Invalid department 1', 'Invalid department 1'],
    })

    await waitFor(() => expect(errorTracker.error).toHaveBeenCalled())

    console.warn.mockClear()
    errorTracker.error.mockClear()

    reduxStore.dispatch(
      updateSettings({
        webWidget: {
          chat: {
            departments: {
              enabled: ['A different invalid department'],
            },
          },
        },
      })
    )

    await waitFor(() => expect(console.warn).toHaveBeenCalled())
    expect(errorTracker.error).not.toHaveBeenCalled()
  })

  it('logs the warning only after Chat connects', async () => {
    jest.spyOn(console, 'warn')

    const { reduxStore } = runScenario({
      connectChat: false,
      enabledDepartments: ['Invalid department 1', 'Invalid department 1'],
    })

    expect(console.warn).not.toHaveBeenCalled()

    reduxStore.dispatch({
      type: SDK_CONNECTION_UPDATE,
      payload: { detail: CONNECTION_STATUSES.CONNECTED },
    })

    expect(console.warn).toHaveBeenCalled()
  })

  it('does not consider duplicated valid departments as invalid', () => {
    jest.spyOn(console, 'warn')

    runScenario({
      enabledDepartments: ['Department one', 'Department one'],
    })

    expect(console.warn).not.toHaveBeenCalled()
  })
})

import { getChatConnected } from 'src/embeds/chat/selectors'
import errorTracker from 'src/framework/services/errorTracker'
import { getEnabledDepartments } from 'src/redux/modules/selectors'
import { getRawSettingsChatDepartmentsEnabled } from 'src/redux/modules/settings/settings-selectors'

const getAllInvalidDepartmentsMessage = (departmentNames) =>
  `\nA note from Zendesk: Your usage of the Web Widget zESetting webWidget.chat.departments.enabled may result in your Web Widget not being displayed.` +
  `\nYou have configured Chat to only be enabled when specific departments are online. However, these departments either aren't enabled for your Web Widget or don't exist.` +
  `\n\nwebWidget.chat.departments.enabled = ${JSON.stringify(departmentNames)}\n` +
  `\nPlease verify your usage of this zESetting and confirm it contains the correct departments you want to use for your Web Widget.` +
  `\nFor more information, see https://developer.zendesk.com/api-reference/widget/settings/#departmentsenabled`

const getSomeInvalidDepartmentsMessage = (departmentNames) =>
  `Unknown department(s) ${JSON.stringify(
    departmentNames
  )} provided to zESetting webWidget.chat.departments.enabled.`

const verifyDepartmentsSettingUsage = (reduxStore) => {
  let hasChatInitialised = false
  let hasLoggedToRollbar = false

  let previousEnabledDepartmentsSetting

  reduxStore.subscribe(() => {
    if (!hasChatInitialised) {
      if (getChatConnected(reduxStore.getState())) {
        hasChatInitialised = true
      }
    }

    if (hasChatInitialised) {
      const rawSettings = getRawSettingsChatDepartmentsEnabled(reduxStore.getState())
      const departmentsEnabled = getEnabledDepartments(reduxStore.getState())

      if (!Array.isArray(rawSettings) || !Array.isArray(departmentsEnabled)) {
        return
      }

      if (previousEnabledDepartmentsSetting === rawSettings) {
        return
      }

      previousEnabledDepartmentsSetting = rawSettings

      const settingsWithoutEmptyStrings = rawSettings.filter((department) => department !== '')

      if (settingsWithoutEmptyStrings.length > 0 && departmentsEnabled.length === 0) {
        // eslint-disable-next-line no-console
        console.warn(getAllInvalidDepartmentsMessage(rawSettings))

        if (!hasLoggedToRollbar) {
          errorTracker.error(new Error('Invalid usage of departments.enabled'))
          hasLoggedToRollbar = true
        }
        return
      }

      if (
        settingsWithoutEmptyStrings.length > 0 &&
        departmentsEnabled.length > 0 &&
        departmentsEnabled.length < settingsWithoutEmptyStrings.length
      ) {
        const validDepartmentOptions = {}
        departmentsEnabled.forEach((department) => {
          validDepartmentOptions[department.id] = true
          validDepartmentOptions[department.name.toLowerCase()] = true
        })
        const invalidDepartments = settingsWithoutEmptyStrings.filter((department) => {
          return !validDepartmentOptions[department?.toLowerCase?.() || department]
        })

        if (invalidDepartments.length > 0) {
          // eslint-disable-next-line no-console
          console.warn(getSomeInvalidDepartmentsMessage(invalidDepartments))
        }
      }
    }
  })
}

export default verifyDepartmentsSettingUsage

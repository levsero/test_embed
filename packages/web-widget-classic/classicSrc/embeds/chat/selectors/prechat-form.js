import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import {
  getAccountDefaultDepartmentId,
  getDepartment,
  getDepartmentsList,
  getIsAuthenticated,
  getLoginSettings,
  getSocialLogin,
} from 'classicSrc/embeds/chat/selectors'
import {
  getDefaultFormFields,
  getPrechatFormFields,
  getPrechatFormSettings,
} from 'classicSrc/redux/modules/selectors'
import {
  getSettingsChatDepartment,
  getSettingsChatDepartmentsEnabled,
  getSettingsChatPrechatForm,
} from 'classicSrc/redux/modules/settings/settings-selectors'
import _ from 'lodash'
import { createSelector } from 'reselect'

const getCanViewDepartmentSelect = (state) => {
  const customerDefinedDepartmentsEnabled = getSettingsChatDepartmentsEnabled(state)
  const { departments = [] } = getPrechatFormFields(state)

  if (
    Array.isArray(customerDefinedDepartmentsEnabled) &&
    customerDefinedDepartmentsEnabled.length === 0
  ) {
    return false
  }

  if (departments.length === 0) {
    return false
  }

  if (departments.length === 1 && departments[0].isDefault) {
    return false
  }

  return true
}

const getDepartmentLabel = (state) => {
  const prechatFormSettings = getSettingsChatPrechatForm(state)
  const defaultFields = getDefaultFormFields(state)

  const labelFromSettings = prechatFormSettings?.departmentLabel
  const labelFromChat = defaultFields?.department?.label
  const fallbackLabel = i18n.t('embeddable_framework.chat.form.common.dropdown.chooseDepartment')

  return i18n.getSettingTranslation(labelFromSettings) || labelFromChat || fallbackLabel
}

export const getVisiblePrechatFields = (state, options = {}) => {
  const prechatFormFields = getPrechatFormFields(state)
  const loginSettings = getLoginSettings(state)
  const isAuthenticated = getIsAuthenticated(state)
  const { authenticated: isSociallyLoggedIn } = getSocialLogin(state)
  // If the user has selected an offline department,
  // then all other fields except the phone field are changed to be required
  const selectedDepartment = getDepartment(state, options.department)
  const isDepartmentOffline = selectedDepartment?.status === 'offline' ? true : undefined

  return [
    {
      id: 'name',
      title: i18n.t('embeddable_framework.common.textLabel.name'),
      required: Boolean(prechatFormFields.name?.required || isDepartmentOffline),
      visible: loginSettings.enabled && !isAuthenticated && !isSociallyLoggedIn,
      type: 'text',
    },
    {
      id: 'socialLogin',
      type: 'socialLogin',
      visible: loginSettings.enabled && !isAuthenticated && !isSociallyLoggedIn,
    },
    {
      id: 'email',
      title: i18n.t('embeddable_framework.common.textLabel.email'),
      required: Boolean(prechatFormFields.email?.required || isDepartmentOffline),
      visible: loginSettings.enabled && !isAuthenticated && !isSociallyLoggedIn,
      type: 'email',
    },
    {
      id: 'department',
      title: getDepartmentLabel(state),
      required: Boolean(prechatFormFields.department?.required),
      visible: getCanViewDepartmentSelect(state),
      type: 'dropdown',
      options: prechatFormFields.departments?.map((department) => ({
        name: department.name,
        value: department.id,
        disabled: department.disabled,
      })),
    },
    {
      id: 'phone',
      title: i18n.t('embeddable_framework.common.textLabel.phone_number'),
      required: Boolean(prechatFormFields.phone?.required),
      visible: loginSettings.enabled && !isAuthenticated && loginSettings.phoneEnabled,
      type: 'text',
    },
    {
      id: 'message',
      title: i18n.t('embeddable_framework.common.textLabel.message'),
      required: Boolean(prechatFormFields.message?.required || isDepartmentOffline),
      visible: true,
      type: 'textarea',
    },
  ].filter((field) => field.visible)
}

export const getPrechatGreeting = (state) => getPrechatFormSettings(state).message

export const getDefaultSelectedDepartment = createSelector(
  [getSettingsChatDepartment, getAccountDefaultDepartmentId, getDepartmentsList],
  (settingsDefaultDeparmentNameOrId, accountDefaultDepartmentId, departments) => {
    const departmentNameOrId = settingsDefaultDeparmentNameOrId || accountDefaultDepartmentId

    return _.find(
      departments,
      (dept) => dept.name.toLowerCase() === departmentNameOrId || dept.id === departmentNameOrId
    )
  }
)

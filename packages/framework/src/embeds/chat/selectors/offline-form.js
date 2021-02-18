import { getOfflineFormFields } from 'src/redux/modules/selectors'
import {
  getIsAuthenticated,
  getLoginSettings,
  getSocialLogin,
} from 'src/redux/modules/chat/chat-selectors'
import { i18n } from 'src/apps/webWidget/services/i18n'

export const getFields = (state) => {
  const { phoneEnabled } = getLoginSettings(state)
  const offlineFormFields = getOfflineFormFields(state)
  const isAuthenticated = getIsAuthenticated(state)
  const sociallyLoggedIn = getSocialLogin(state).authenticated

  return [
    {
      id: 'name',
      title: i18n.t('embeddable_framework.common.textLabel.name'),
      required: Boolean(offlineFormFields.name?.required),
      visible: !isAuthenticated && !sociallyLoggedIn,
      type: 'text',
    },
    {
      id: 'socialLogin',
      type: 'socialLogin',
      visible: !isAuthenticated && !sociallyLoggedIn,
    },
    {
      id: 'email',
      title: i18n.t('embeddable_framework.common.textLabel.email'),
      required: Boolean(offlineFormFields.email?.required),
      visible: !isAuthenticated && !sociallyLoggedIn,
      type: 'text',
    },
    {
      id: 'phone',
      title: i18n.t('embeddable_framework.common.textLabel.phone_number'),
      required: Boolean(offlineFormFields.phone?.required),
      visible: !isAuthenticated && phoneEnabled,
      type: 'text',
    },
    {
      id: 'message',
      title: i18n.t('embeddable_framework.common.textLabel.message'),
      required: Boolean(offlineFormFields.message?.required),
      visible: true,
      type: 'textarea',
    },
  ].filter((field) => field.visible)
}

import { getSettingsTalkTitle } from 'src/redux/modules/settings/settings-selectors'
import { i18n } from 'service/i18n'
import { getCapability } from 'src/redux/modules/talk/talk-selectors'
import { CONTACT_OPTIONS } from 'src/embeds/talk/constants'

export const getTitle = (state, fallback) => {
  return i18n.getSettingTranslation(getSettingsTalkTitle(state)) || i18n.t(fallback)
}

// export const getSnapcallButtonId = state => getEmbeddableConfig(state).snapcallButtonId
export const getSnapcallButtonId = _state => 'YOUR_SNAPCALL_BUTTON_ID'

export const getOfflineTitle = state => {
  const capability = getCapability(state)
  const title = i18n.getSettingTranslation(getSettingsTalkTitle(state))

  if (title) {
    return title
  }

  switch (capability) {
    case CONTACT_OPTIONS.PHONE_ONLY:
      return i18n.t('embeddable_framework.talk.phoneOnly.title')
    case CONTACT_OPTIONS.CALLBACK_AND_PHONE:
    case CONTACT_OPTIONS.CALLBACK_ONLY:
    default:
      return i18n.t('embeddable_framework.talk.form.title')
  }
}

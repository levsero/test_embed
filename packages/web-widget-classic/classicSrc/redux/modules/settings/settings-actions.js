import { CONNECTION_STATUSES } from 'classicSrc/constants/chat'
import { getConnection, getZChatVendor } from 'classicSrc/embeds/chat/selectors'
import { setDepartment } from 'classicSrc/redux/modules/chat'
import { getDefaultSelectedDepartment } from 'classicSrc/redux/modules/selectors'
import { getSettingsChatTags } from 'classicSrc/redux/modules/settings/settings-selectors'
import { settings as legacySettings } from 'classicSrc/service/settings'
import _ from 'lodash'
import { UPDATE_SETTINGS } from './settings-action-types'

const handleTagsChange = (zChat, tags = [], oldTags = []) => {
  if (_.isEqual(tags, oldTags) || !_.isArray(tags) || !_.isArray(oldTags)) {
    return
  }

  const toAdd = _.difference(tags, oldTags)
  const toRemove = _.difference(oldTags, tags)

  toAdd.length > 0 && zChat.addTags(toAdd)
  toRemove.length > 0 && zChat.removeTags(toRemove)
}

export function updateSettings(settings) {
  return (dispatch, getState) => {
    if (!_.get(settings, 'webWidget')) {
      settings = {
        webWidget: {
          ...settings,
        },
      }
    }

    if (settings?.webWidget?.authenticate?.chat?.jwtFn) {
      legacySettings.storeChatAuth(settings.webWidget.authenticate.chat.jwtFn)
    }

    if (settings?.webWidget?.authenticate?.jwtFn) {
      legacySettings.storeHelpCenterAuth(settings.webWidget.authenticate.jwtFn)
    }

    const oldTags = getSettingsChatTags(getState())

    dispatch({
      type: UPDATE_SETTINGS,
      payload: settings,
    })

    const state = getState()

    if (getConnection(state) === CONNECTION_STATUSES.CONNECTED) {
      dispatch(updateChatSettings(oldTags))
    }
  }
}

export function updateChatSettings(oldTags) {
  return (dispatch, getState) => {
    const state = getState()
    const tags = getSettingsChatTags(state)
    const zChat = getZChatVendor(state)
    const visitorDepartmentId = _.get(getDefaultSelectedDepartment(state), 'id')

    handleTagsChange(zChat, tags, oldTags)

    if (visitorDepartmentId) {
      dispatch(setDepartment(visitorDepartmentId))
    }
  }
}

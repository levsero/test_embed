import { combineReducers } from 'redux'

import enabled from './chat-departments-enabled'
import select from './chat-departments-select'

import suppress from './chat-suppress'
import connectionSuppress from './chat-connectionSuppress'
import connectOnDemand from './chat-connectOnDemand'
import concierge from './chat-concierge'
import profileCard from './chat-profile-card'
import prechatForm from './chat-prechat-form'
import offlineForm from './chat-offline-form'
import title from './chat-title'
import mobileNotificationsDisabled from './chat-mobile-notifications-disabled'
import tags from './chat-tags'
import hideWhenOffline from './chat-hideWhenOffline'
import emailTranscriptEnabled from './email-transcript-enabled'

export default combineReducers({
  concierge,
  connectionSuppress,
  connectOnDemand,
  departments: combineReducers({ enabled, select }),
  emailTranscriptEnabled,
  hideWhenOffline,
  mobileNotificationsDisabled,
  offlineForm,
  prechatForm,
  profileCard,
  suppress,
  tags,
  title
})

import { combineReducers } from 'redux'
import concierge from './chat-concierge'
import connectOnDemand from './chat-connectOnDemand'
import connectionSuppress from './chat-connectionSuppress'
import enabled from './chat-departments-enabled'
import select from './chat-departments-select'
import hideWhenOffline from './chat-hideWhenOffline'
import mobileNotificationsDisabled from './chat-mobile-notifications-disabled'
import offlineForm from './chat-offline-form'
import prechatForm from './chat-prechat-form'
import profileCard from './chat-profile-card'
import suppress from './chat-suppress'
import tags from './chat-tags'
import title from './chat-title'
import connectOnPageLoad from './connectOnPageLoad'
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
  title,
  connectOnPageLoad,
})

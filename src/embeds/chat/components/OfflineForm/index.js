import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import _ from 'lodash'

import useTranslate from 'src/hooks/useTranslate'
import DynamicForm from 'components/DynamicForm'
import AuthenticatedProfile from 'embeds/chat/components/AuthenticatedProfile'
import ViewHistoryButton from 'embeds/chat/components/ViewHistoryButton'
import SocialLogin from 'embeds/chat/components/SocialLogin'
import OfflineGreeting from 'src/embeds/chat/components/OfflineForm/OfflineGreeting'
import OperatingHours from 'src/embeds/chat/components/OfflineForm/OperatingHours'
import ChatMessagingChannels from 'component/chat/ChatMessagingChannels'
import { getFields } from 'src/embeds/chat/selectors/offline-form'
import { submitOfflineForm } from 'src/embeds/chat/actions/offline-form'
import { Footer } from 'src/components/Widget'
import {
  getAuthUrls,
  getChatVisitor,
  getGroupedOperatingHours,
  getIsAuthenticated,
  getReadOnlyState,
  getSocialLogin
} from 'src/redux/modules/chat/chat-selectors'
import { handleOperatingHoursClick, initiateSocialLogout } from 'src/redux/modules/chat'
import { getOfflineFormSettings } from 'src/redux/modules/selectors'
import OfflineFormControls from 'src/embeds/chat/components/OfflineForm/OfflineFormControls'
import validate from './validate'
import SubmitButton from 'src/components/DynamicForm/SubmitButton'

const OfflineForm = ({
  authUrls,
  formSettings: { channels, message },
  getFields,
  handleOperatingHoursClick,
  initiateSocialLogout,
  isAuthenticated,
  isPreview = false,
  operatingHours = { enabled: false },
  readOnlyValues,
  onSubmit,
  setHasSubmitted,
  socialLogin,
  visitor
}) => {
  const translate = useTranslate()

  const anyMessagingChannels = !_.isEmpty(channels)
  const isLoggedIn = isAuthenticated || socialLogin.authenticated

  const handleSubmit = async values => {
    try {
      await onSubmit(values, isLoggedIn ? { name: visitor.display_name, email: visitor.email } : {})
      setHasSubmitted()
      return { success: true }
    } catch {
      return { success: false }
    }
  }

  return (
    <DynamicForm
      controls={<OfflineFormControls />}
      formId={'offline-form'}
      onSubmit={handleSubmit}
      getFields={getFields}
      isPreview={isPreview}
      validate={values => validate({ values, isAuthenticated, fields: getFields() })}
      footer={({ isSubmitting }) => (
        <Footer>
          <SubmitButton
            label={translate('embeddable_framework.chat.preChat.offline.button.sendMessage')}
            submitting={isSubmitting}
          />
        </Footer>
      )}
      extraFieldOptions={{
        socialLogin: () => <SocialLogin authUrls={authUrls} />
      }}
      readOnlyValues={readOnlyValues}
    >
      <ViewHistoryButton />

      {message && <OfflineGreeting greeting={message} />}
      {operatingHours.enabled && <OperatingHours onClick={handleOperatingHoursClick} />}
      {anyMessagingChannels && <ChatMessagingChannels channels={channels} />}
      {isLoggedIn && (
        <AuthenticatedProfile
          visitor={visitor}
          socialLogin={socialLogin}
          initiateSocialLogout={initiateSocialLogout}
        />
      )}
    </DynamicForm>
  )
}

OfflineForm.propTypes = {
  authUrls: SocialLogin.propTypes.authUrls,
  formSettings: PropTypes.shape({
    message: PropTypes.string,
    channels: PropTypes.shape({
      facebook: PropTypes.shape({
        allowed: PropTypes.bool,
        page_id: PropTypes.string
      }),
      twitter: PropTypes.shape({
        allowed: PropTypes.bool,
        page_id: PropTypes.string
      })
    })
  }),
  getFields: PropTypes.func.isRequired,
  handleOperatingHoursClick: PropTypes.func.isRequired,
  initiateSocialLogout: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isPreview: PropTypes.bool,
  offlineMessage: PropTypes.shape({ screen: PropTypes.string }),
  operatingHours: PropTypes.object,
  readOnlyValues: PropTypes.objectOf(PropTypes.bool),
  onSubmit: PropTypes.func.isRequired,
  setHasSubmitted: PropTypes.func.isRequired,
  socialLogin: AuthenticatedProfile.propTypes.socialLogin,
  visitor: PropTypes.shape({ display_name: PropTypes.string, email: PropTypes.string })
}

const mapStateToProps = state => ({
  authUrls: getAuthUrls(state),
  formSettings: getOfflineFormSettings(state),
  getFields: () => getFields(state),
  isAuthenticated: getIsAuthenticated(state),
  operatingHours: getGroupedOperatingHours(state),
  readOnlyValues: getReadOnlyState(state),
  socialLogin: getSocialLogin(state),
  visitor: getChatVisitor(state)
})

const actionCreators = {
  handleOperatingHoursClick,
  initiateSocialLogout,
  onSubmit: submitOfflineForm
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators
)(OfflineForm)

export { connectedComponent as default, OfflineForm as Component }

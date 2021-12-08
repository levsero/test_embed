import ChatMessagingChannels from 'classicSrc/component/chat/ChatMessagingChannels'
import DynamicForm from 'classicSrc/components/DynamicForm'
import SubmitButton from 'classicSrc/components/DynamicForm/SubmitButton'
import { Footer } from 'classicSrc/components/Widget'
import { submitOfflineForm } from 'classicSrc/embeds/chat/actions/offline-form'
import AuthenticatedProfile from 'classicSrc/embeds/chat/components/AuthenticatedProfile'
import OfflineFormControls from 'classicSrc/embeds/chat/components/OfflineForm/OfflineFormControls'
import OfflineGreeting from 'classicSrc/embeds/chat/components/OfflineForm/OfflineGreeting'
import OperatingHours from 'classicSrc/embeds/chat/components/OfflineForm/OperatingHours'
import SocialLogin from 'classicSrc/embeds/chat/components/SocialLogin'
import ViewHistoryButton from 'classicSrc/embeds/chat/components/ViewHistoryButton'
import {
  getAuthUrls,
  getChatVisitor,
  getGroupedOperatingHours,
  getIsAuthenticated,
  getReadOnlyState,
  getSocialLogin,
} from 'classicSrc/embeds/chat/selectors'
import { getFields } from 'classicSrc/embeds/chat/selectors/offline-form'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { handleOperatingHoursClick, initiateSocialLogout } from 'classicSrc/redux/modules/chat'
import { getOfflineFormSettings } from 'classicSrc/redux/modules/selectors'
import _ from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import validate from './validate'

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
  visitor,
}) => {
  const translate = useTranslate()

  const anyMessagingChannels = !_.isEmpty(channels)
  const isLoggedIn = isAuthenticated || socialLogin.authenticated

  const handleSubmit = async (values) => {
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
      validate={(values) => validate({ values, isAuthenticated, fields: getFields() })}
      footer={({ isSubmitting }) => (
        <Footer>
          <SubmitButton
            label={translate('embeddable_framework.chat.preChat.offline.button.sendMessage')}
            submitting={isSubmitting}
          />
        </Footer>
      )}
      extraFieldOptions={{
        socialLogin: () => <SocialLogin authUrls={authUrls} />,
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
        page_id: PropTypes.string,
      }),
      twitter: PropTypes.shape({
        allowed: PropTypes.bool,
        page_id: PropTypes.string,
      }),
    }),
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
  visitor: PropTypes.shape({ display_name: PropTypes.string, email: PropTypes.string }),
}

const mapStateToProps = (state) => ({
  authUrls: getAuthUrls(state),
  formSettings: getOfflineFormSettings(state),
  getFields: () => getFields(state),
  isAuthenticated: getIsAuthenticated(state),
  operatingHours: getGroupedOperatingHours(state),
  readOnlyValues: getReadOnlyState(state),
  socialLogin: getSocialLogin(state),
  visitor: getChatVisitor(state),
})

const actionCreators = {
  handleOperatingHoursClick,
  initiateSocialLogout,
  onSubmit: submitOfflineForm,
}

const connectedComponent = connect(mapStateToProps, actionCreators)(OfflineForm)

export { connectedComponent as default, OfflineForm as Component }

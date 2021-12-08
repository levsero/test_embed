import { OFFLINE_FORM_SCREENS } from 'classicSrc/constants/chat'
import NoAgentsPage from 'classicSrc/embeds/chat/pages/NoAgentsPage'
import OfflineFormPage from 'classicSrc/embeds/chat/pages/OfflineFormPage'
import OperatingHoursPage from 'classicSrc/embeds/chat/pages/OperatingHoursPage'
import { getOfflineMessage } from 'classicSrc/embeds/chat/selectors'
import { getOfflineFormSettings } from 'classicSrc/redux/modules/selectors'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

const ChatOffline = ({
  formSettings: { enabled: offlineFormEnabled = false },
  offlineMessage: { screen },
}) => {
  if (screen === OFFLINE_FORM_SCREENS.OPERATING_HOURS) return <OperatingHoursPage />

  return offlineFormEnabled ? <OfflineFormPage /> : <NoAgentsPage />
}

ChatOffline.propTypes = {
  formSettings: PropTypes.shape({ enabled: PropTypes.bool }).isRequired,
  offlineMessage: PropTypes.shape({
    screen: PropTypes.oneOf(Object.values(OFFLINE_FORM_SCREENS)),
  }),
}

const mapStateToProps = (state) => ({
  formSettings: getOfflineFormSettings(state),
  offlineMessage: getOfflineMessage(state),
})

const connectedComponent = connect(mapStateToProps, null, null, { forwardRef: true })(ChatOffline)

export { connectedComponent as default, ChatOffline as Component }

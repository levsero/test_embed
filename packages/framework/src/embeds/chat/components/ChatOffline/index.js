import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { OFFLINE_FORM_SCREENS } from 'src/constants/chat'
import NoAgentsPage from 'src/embeds/chat/pages/NoAgentsPage'
import OfflineFormPage from 'src/embeds/chat/pages/OfflineFormPage'
import OperatingHoursPage from 'src/embeds/chat/pages/OperatingHoursPage'
import { getOfflineMessage } from 'src/embeds/chat/selectors'
import { getOfflineFormSettings } from 'src/redux/modules/selectors'

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

import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isMobileBrowser, isPopout } from '@zendesk/widget-shared-services'
import ChatNotificationPopup from 'src/components/NotificationPopup'
import { getResultsCount } from 'src/embeds/helpCenter/selectors'
import { updateActiveEmbed } from 'src/redux/modules/base'
import { chatNotificationDismissed, chatNotificationRespond } from 'src/redux/modules/chat'
import { getChatNotification } from 'src/redux/modules/selectors'

const Popup = ({
  updateActiveEmbed,
  chatNotificationRespond,
  isMobile,
  resultsCount,
  chatNotification,
  fullscreen,
  chatNotificationDismissed,
}) => {
  const onNotificatonResponded = () => {
    updateActiveEmbed('chat')
    chatNotificationRespond()
  }

  return (
    <ChatNotificationPopup
      resultsCount={resultsCount}
      isMobile={isMobile}
      notification={chatNotification}
      fullscreen={fullscreen}
      chatNotificationRespond={onNotificatonResponded}
      chatNotificationDismissed={chatNotificationDismissed}
    />
  )
}

Popup.propTypes = {
  updateActiveEmbed: PropTypes.func.isRequired,
  chatNotificationRespond: PropTypes.func.isRequired,
  isMobile: PropTypes.bool.isRequired,
  resultsCount: PropTypes.number.isRequired,
  chatNotification: PropTypes.object.isRequired,
  fullscreen: PropTypes.bool.isRequired,
  chatNotificationDismissed: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => ({
  isMobile: isMobileBrowser(),
  resultsCount: getResultsCount(state),
  fullscreen: isPopout(),
  chatNotification: getChatNotification(state),
})

const actionCreators = {
  chatNotificationDismissed,
  chatNotificationRespond,
  updateActiveEmbed,
}

const connectedComponent = connect(mapStateToProps, actionCreators)(Popup)

export { connectedComponent as default, Popup as Component }

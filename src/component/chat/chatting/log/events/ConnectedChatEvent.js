import { connect } from 'react-redux'
import EventMessage from './EventMessage'
import { getEventMessage } from 'src/redux/modules/chat/chat-selectors'
import { i18n } from 'service/i18n'

const mapStateToProps = (state, props) => ({
  event: getEventMessage(state, props.eventKey),
  locale: i18n.getLocale()
})

export default connect(
  mapStateToProps,
  {},
  null,
  { forwardRef: true }
)(EventMessage)

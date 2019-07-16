import { connect } from 'react-redux'
import EventMessage from './EventMessage'
import { getEventMessage } from 'src/redux/modules/chat/chat-history-selectors'

const mapStateToProps = (state, props) => ({
  event: getEventMessage(state, props.eventKey)
})

export default connect(
  mapStateToProps,
  {},
  null,
  { forwardRef: true }
)(EventMessage)

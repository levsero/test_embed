import { connect } from 'react-redux'
import { getGroupMessages } from 'src/embeds/chat/selectors'
import ChatGroup from './ChatGroup'

const mapStateToProps = (state, props) => ({
  messages: getGroupMessages(state, props.messageKeys),
})

export default connect(mapStateToProps, {}, null, { forwardRef: true })(ChatGroup)

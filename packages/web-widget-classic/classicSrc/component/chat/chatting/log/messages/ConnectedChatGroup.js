import { getGroupMessages } from 'classicSrc/embeds/chat/selectors'
import { connect } from 'react-redux'
import ChatGroup from './ChatGroup'

const mapStateToProps = (state, props) => ({
  messages: getGroupMessages(state, props.messageKeys),
})

export default connect(mapStateToProps, {}, null, { forwardRef: true })(ChatGroup)

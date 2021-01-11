import { connect } from 'react-redux'
import ChatGroup from './ChatGroup'
import { getGroupMessages } from 'src/redux/modules/chat/chat-history-selectors'
import { i18n } from 'src/apps/webWidget/services/i18n'

const mapStateToProps = (state, props) => ({
  messages: getGroupMessages(state, props.messageKeys),
  locale: i18n.getLocale()
})

export default connect(
  mapStateToProps,
  {},
  null,
  { forwardRef: true }
)(ChatGroup)

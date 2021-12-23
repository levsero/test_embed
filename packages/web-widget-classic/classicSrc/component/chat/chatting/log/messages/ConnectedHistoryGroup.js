import { i18n } from 'classicSrc/app/webWidget/services/i18n'
import { getGroupMessages } from 'classicSrc/redux/modules/chat/chat-history-selectors'
import { connect } from 'react-redux'
import ChatGroup from './ChatGroup'

const mapStateToProps = (state, props) => ({
  messages: getGroupMessages(state, props.messageKeys),
  locale: i18n.getLocale(),
})

export default connect(mapStateToProps, {}, null, { forwardRef: true })(ChatGroup)

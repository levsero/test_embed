import { connect } from 'react-redux';
import ChatGroup from './ChatGroup';
import { getGroupMessages } from 'src/redux/modules/chat/chat-history-selectors';
import { i18n } from 'service/i18n';

const mapStateToProps = (state, props) => ({
  messages: getGroupMessages(state, props.messageKeys),
  locale: i18n.getLocale()
});

export default connect(mapStateToProps, {}, null, { withRef: true })(ChatGroup);

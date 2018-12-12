import { connect } from 'react-redux';
import ChatGroup from './ChatGroup';
import { getGroupMessages } from 'src/redux/modules/chat/chat-history-selectors';

const mapStateToProps = (state, props) => ({
  messages: getGroupMessages(state, props.messageKeys)
});

export default connect(mapStateToProps, {}, null, { withRef: true })(ChatGroup);

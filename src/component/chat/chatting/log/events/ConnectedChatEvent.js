import { connect } from 'react-redux';
import EventMessage from './EventMessage';
import { getGroupMessages } from 'src/redux/modules/chat/chat-selectors';

const mapStateToProps = (state, props) => ({
  event: getGroupMessages(state, [props.eventKey])[0]
});

export default connect(mapStateToProps, {}, null, { withRef: true })(EventMessage);

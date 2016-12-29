import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import { ChatBox } from 'component/chat/ChatBox';
import { Container } from 'component/container/Container';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { i18n } from 'service/i18n';
import { sendMsg, updateCurrentMsg } from 'src/redux/actions/chat';

const mapStateToProps = (state) => {
  return { chat: state.chat };
};

class Chat extends Component {
  static propTypes = {
    position: PropTypes.string,
    style: PropTypes.object
  };

  static defaultProps = {
    position: 'right',
    style: null
  };

  render = () => {
    return (
      <Container
        style={this.props.style}
        position={this.props.position}
        expanded={true}>
        <ScrollContainer
          title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
          contentExpanded={true}>
          <ChatBox
            chat={this.props.chat}
            sendMsg={this.props.sendMsg}
            updateCurrentMsg={this.props.updateCurrentMsg} />
        </ScrollContainer>
      </Container>
    );
  }
}

export default connect(mapStateToProps, { sendMsg, updateCurrentMsg }, null, { withRef: true })(Chat);

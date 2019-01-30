import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import MessageGroup from './messageGroup';
import { conversationScreenClosed } from 'src/redux/modules/answerBot/conversation/actions';
import { getMessageGroupKeys } from 'src/redux/modules/answerBot/conversation/selectors';
import { updateBackButtonVisibility } from 'src/redux/modules/base/base-actions';
import { getSettingsAnswerBotAvatarUrl } from 'src/redux/modules/settings/settings-selectors';
import { getSettingsAnswerBotAvatarName } from 'src/redux/modules/selectors';
import { locals as styles } from './ConversationScreen.scss';

class ConversationScreen extends Component {
  static propTypes = {
    messageGroups: PropTypes.object.isRequired,
    scrollToBottom: PropTypes.func,
    actions: PropTypes.shape({
      conversationScreenClosed: PropTypes.func.isRequired,
      updateBackButtonVisibility: PropTypes.func.isRequired
    }),
    agentAvatarUrl: PropTypes.string,
    agentAvatarName: PropTypes.string
  };

  static defaultProps = {
    scrollToBottom: () => {},
    agentAvatarName: '',
    agentAvatarUrl: '',
  };

  componentDidMount() {
    this.props.actions.updateBackButtonVisibility(false);
  }

  componentWillUnmount() {
    this.props.actions.conversationScreenClosed();
  }

  render = () => {
    return (
      <div className={styles.messages}>
        {_.map(
          this.props.messageGroups,
          (group, key) => (
            <MessageGroup
              key={key}
              isVisitor={!!group.isVisitor}
              messageKeys={group.messageKeys}
              scrollToBottom={this.props.scrollToBottom}
              agentAvatarName={this.props.agentAvatarName}
              agentAvatarUrl={this.props.agentAvatarUrl}
            />
          )
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    messageGroups: getMessageGroupKeys(state),
    agentAvatarName: getSettingsAnswerBotAvatarName(state),
    agentAvatarUrl: getSettingsAnswerBotAvatarUrl(state)
  };
};

const actionCreators = (dispatch) => ({
  actions: bindActionCreators({
    conversationScreenClosed,
    updateBackButtonVisibility
  }, dispatch)
});

const connectedComponent = connect(mapStateToProps, actionCreators, null, { withRef: true })(ConversationScreen);

export {
  connectedComponent as default,
  ConversationScreen as Component
};

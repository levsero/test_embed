import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { locals as styles } from './ChatHistoryLog.scss';

import { ChatGroup } from 'component/chat/ChatGroup';
import { ChatEventMessage } from 'component/chat/ChatEventMessage';
import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';

export class ChatHistoryLog extends Component {
  static propTypes = {
    chatHistoryLog: PropTypes.array,
    agents: PropTypes.object,
    showAvatar: PropTypes.bool.isRequired
  };

  static defaultProps = {
    chatHistoryLog: []
  };

  constructor(props) {
    super(props);

    this.createdTimestamp = Date.now();
    this.container = null;
  }

  getScrollHeight = () => {
    return (this.container && this.container.scrollHeight) || 0;
  }

  renderPastSession = (pastChats) => {
    const {
      agents,
      showAvatar
    } = this.props;

    return _.map(pastChats, (group, timestamp) => {
      const groupType = _.get(group, '0.type');

      if (_.includes(CHAT_MESSAGE_EVENTS, groupType)) {
        const nick = _.get(group, '0.nick', 'visitor');
        const isAgent = nick.indexOf('agent:') > -1;
        const avatarPath = _.get(agents, `${nick}.avatar_path`);

        return (
          <ChatGroup
            key={timestamp}
            isAgent={isAgent}
            messages={group}
            avatarPath={avatarPath}
            showAvatar={showAvatar}
            chatLogCreatedAt={this.createdTimestamp}
          />
        );
      } else if (_.includes(CHAT_SYSTEM_EVENTS, groupType)) {
        return (
          <ChatEventMessage
            key={timestamp}
            event={group[0]}
            chatLogCreatedAt={this.createdTimestamp}
          />
        );
      }
    });
  }

  render() {
    const chatLogs = _.reduce(this.props.chatHistoryLog, (logs, pastChats) => {
      return logs.concat(this.renderPastSession(pastChats));
    }, []);

    return chatLogs.length ? (
      <div
        ref={(el) => { this.container = el; }}
        className={styles.chatHistoryContainer}
      >
        {chatLogs}
      </div>
    ) : null;
  }
}

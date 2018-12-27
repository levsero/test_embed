import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { dateTime } from 'utility/formatters';
import { locals as styles } from './HistoryLog.scss';

import { ChatGroup } from 'component/chat/chatting/ChatGroup';
import { EventMessage } from 'component/chat/chatting/EventMessage';
import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';

export class HistoryLog extends Component {
  static propTypes = {
    chatHistoryLog: PropTypes.array,
    agents: PropTypes.object,
    showAvatar: PropTypes.bool.isRequired,
    firstMessageTimestamp: PropTypes.number,
    luxon: PropTypes.object.isRequired
  };

  static defaultProps = {
    chatHistoryLog: [],
    firstMessageTimestamp: null
  };

  constructor(props) {
    super(props);

    this.createdTimestamp = Date.now();
    this.container = null;
  }

  getScrollHeight = () => {
    return (this.container && this.container.scrollHeight) || 0;
  }

  renderDivider = (timestamp) => {
    const format = dateTime(this.props.luxon, timestamp, { showToday: true });

    return <div className={styles.divider}>{format}</div>;
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
          <EventMessage
            key={timestamp}
            event={group[0]}
            divider={_.get(group, '0.first') ? this.renderDivider(_.get(group, '0.timestamp')) : null}
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
      >
        {chatLogs}
        {this.renderDivider(this.props.firstMessageTimestamp)}
      </div>
    ) : null;
  }
}

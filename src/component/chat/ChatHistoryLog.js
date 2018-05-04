import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { locals as styles } from './ChatHistoryLog.scss';

import { ChatGroup } from 'component/chat/ChatGroup';
import { ChatEventMessage } from 'component/chat/ChatEventMessage';
import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';

export class ChatHistoryLog extends Component {
  static propTypes = {
    chatHistoryLog: PropTypes.array,
    agents: PropTypes.object,
    showAvatar: PropTypes.bool.isRequired,
    firstMessageTimestamp: PropTypes.number,
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

  renderDivider = () => {
    const ts = DateTime.fromMillis(this.props.firstMessageTimestamp);
    const onSameDay = ts.hasSame(Date.now(), 'days');
    let format;

    if (onSameDay) {
      const timeFormat = ts.toLocaleString(DateTime.TIME_SIMPLE);

      format = i18n.t('embeddable_framework.common.today', { time: timeFormat });
    } else {
      format = ts.toLocaleString(DateTime.DATETIME_MED);
    }

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
      >
        {chatLogs}
        {this.renderDivider()}
      </div>
    ) : null;
  }
}

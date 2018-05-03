import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatHistoryLog.scss';

import { ChatGroup } from 'component/chat/ChatGroup';
import { ChatEventMessage } from 'component/chat/ChatEventMessage';
import { CHAT_MESSAGE_EVENTS, CHAT_SYSTEM_EVENTS } from 'constants/chat';

const moment = (() => { try { return require('moment'); } catch (_) {} })();

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
    const ts = moment(this.props.firstMessageTimestamp);
    const isToday = ts.isSame(new Date(), 'day');
    let format = null;

    ts.locale(i18n.getLocale());
    if (isToday) {
      const today = i18n.t('embeddable_framework.common.today');

      format = ts.format(`[${today}] LT`);
    } else {
      format = ts.format('lll');
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

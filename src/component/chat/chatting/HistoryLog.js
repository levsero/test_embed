import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';

import { dateTime } from 'utility/formatters';
import { locals as styles } from './HistoryLog.scss';

import HistoryChatGroup from 'component/chat/chatting/log/messages/ConnectedHistoryGroup';
import HistoryEventMessage from 'component/chat/chatting/log/events/ConnectedHistoryEvent';
import { getHistoryLog } from 'src/redux/modules/chat/chat-history-selectors';

const mapStateToProps = (state) => {
  return {
    chatHistoryLog: getHistoryLog(state)
  };
};

export class HistoryLog extends Component {
  static propTypes = {
    chatHistoryLog: PropTypes.array.isRequired,
    agents: PropTypes.object,
    showAvatar: PropTypes.bool.isRequired,
    firstMessageTimestamp: PropTypes.number,
    luxon: PropTypes.object.isRequired,
    isMobile: PropTypes.bool.isRequired
  };

  static defaultProps = {
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

  renderHistoryLog = () => {
    const chatLogEl = _.map(this.props.chatHistoryLog, (chatGroup) => {
      const { type, author, first } = chatGroup;

      if (type === 'message') {
        const timestamp = chatGroup.messages[0];
        const groupNick = author || 'visitor';
        const isAgent = author.indexOf('agent:') > -1;
        const avatarPath = _.get(this.props.agents, `${groupNick}.avatar_path`);

        return (
          <HistoryChatGroup
            key={timestamp}
            isAgent={isAgent}
            messageKeys={chatGroup.messages}
            avatarPath={avatarPath}
            showAvatar={this.props.showAvatar}
            isMobile={this.props.isMobile}
            chatLogCreatedAt={this.createdTimestamp}
          />
        );
      } else if (type === 'event') {
        const event = chatGroup.messages[0];

        return (
          <HistoryEventMessage
            eventKey={event}
            key={event}
            chatLogCreatedAt={this.createdTimestamp}
            divider={first ? this.renderDivider(event) : null}
          />
        );
      }
    });

    return chatLogEl;
  }

  render() {
    return this.props.chatHistoryLog.length ? (
      <div ref={(el) => { this.container = el; }}>
        {this.renderHistoryLog()}
        {this.renderDivider(this.props.firstMessageTimestamp)}
      </div>
    ) : null;
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(HistoryLog);

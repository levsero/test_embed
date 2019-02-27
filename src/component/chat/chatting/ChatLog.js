import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatLog.scss';

import ChatGroup from 'component/chat/chatting/log/messages/ConnectedChatGroup';
import EventMessage from 'component/chat/chatting/log/events/ConnectedChatEvent';
import { Button } from '@zendeskgarden/react-buttons';
import {
  getChatLog,
  getFirstVisitorMessage,
  getLatestRating,
  getLatestRatingRequest,
  getLatestAgentLeaveEvent,
  getShowUpdateVisitorDetails
} from 'src/redux/modules/chat/chat-selectors';
import chatPropTypes from 'types/chat';

const mapStateToProps = (state) => {
  return {
    chatLog: getChatLog(state),
    firstVisitorMessage: getFirstVisitorMessage(state),
    latestRating: getLatestRating(state),
    latestRatingRequest: getLatestRatingRequest(state),
    latestAgentLeaveEvent: getLatestAgentLeaveEvent(state),
    showUpdateInfo: getShowUpdateVisitorDetails(state),
    locale: i18n.getLocale()
  };
};

export class ChatLog extends PureComponent {
  static propTypes = {
    chatLog: PropTypes.arrayOf(chatPropTypes.chatLogEntry),
    firstVisitorMessage: PropTypes.number.isRequired,
    latestRating: PropTypes.number.isRequired,
    latestRatingRequest: PropTypes.number.isRequired,
    latestAgentLeaveEvent: PropTypes.number.isRequired,
    agents: PropTypes.object,
    chatCommentLeft: PropTypes.bool.isRequired,
    goToFeedbackScreen: PropTypes.func.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    handleSendMsg: PropTypes.func,
    onImageLoad: PropTypes.func,
    showUpdateInfo: PropTypes.bool.isRequired,
    updateInfoOnClick: PropTypes.func,
    socialLogin: PropTypes.object,
    conciergeAvatar: PropTypes.string,
    isMobile: PropTypes.bool.isRequired
  };

  static defaultProps = {
    socialLogin: {}
  };

  constructor(props) {
    super(props);

    this.createdTimestamp = Date.now();
  }

  renderGroup = (group) => {
    const {
      agents,
      showAvatar,
      handleSendMsg,
      onImageLoad,
      socialLogin,
      conciergeAvatar,
      isMobile
    } = this.props;

    if (group.type === 'message') {
      const firstMessageKey = group.messages[0];
      const groupNick = group.author || 'visitor';
      const isAgent = group.author.indexOf('agent:') > -1;
      const avatarPath = _.get(agents, `${groupNick}.avatar_path`) || conciergeAvatar;

      return (
        <ChatGroup
          key={firstMessageKey}
          isAgent={isAgent}
          messageKeys={group.messages}
          avatarPath={avatarPath}
          showAvatar={showAvatar}
          onImageLoad={onImageLoad}
          handleSendMsg={handleSendMsg}
          socialLogin={socialLogin}
          chatLogCreatedAt={this.createdTimestamp}
          isMobile={isMobile}>
          {this.renderUpdateInfo(firstMessageKey)}
        </ChatGroup>
      );
    }

    if (group.type === 'event') {
      const eventKey = group.messages[0];

      return (
        <EventMessage
          key={eventKey}
          eventKey={eventKey}
          chatLogCreatedAt={this.createdTimestamp}>
          {this.renderRequestRatingButton(eventKey)}
        </EventMessage>
      );
    }
  }

  renderRequestRatingButton(eventKey) {
    const {
      agents,
      chatCommentLeft,
      goToFeedbackScreen,
      latestRating,
      latestRatingRequest,
      latestAgentLeaveEvent
    } = this.props;

    const isLatestRating = latestRating === eventKey;
    const isLatestRatingRequest = latestRatingRequest === eventKey;
    const isLastAgentLeaveEvent = _.size(agents) < 1 && latestAgentLeaveEvent === eventKey;

    if (!(
      (isLatestRating && !chatCommentLeft) ||
      isLatestRatingRequest ||
      isLastAgentLeaveEvent
    )) return;

    const labelKey = isLatestRating && !chatCommentLeft
      ? 'embeddable_framework.chat.chatLog.button.leaveComment'
      : 'embeddable_framework.chat.chatLog.button.rateChat';

    return (
      <Button
        className={styles.requestRatingButton}
        onClick={goToFeedbackScreen}>
        {i18n.t(labelKey)}
      </Button>
    );
  }

  renderUpdateInfo(firstMessageKey) {
    const { showUpdateInfo, firstVisitorMessage, updateInfoOnClick } = this.props;

    if (!(showUpdateInfo && firstVisitorMessage === firstMessageKey)) return;

    return (
      <button onClick={updateInfoOnClick} className={styles.updateInfo}>
        {i18n.t('embeddable_framework.chat.chatLog.login.updateInfo')}
      </button>
    );
  }

  render() {
    if (_.isEmpty(this.props.chatLog)) return null;

    return (
      <div>
        {_.map(this.props.chatLog, this.renderGroup)}
      </div>
    );
  }
}

export default connect(mapStateToProps, {}, null, { withRef: true })(ChatLog);

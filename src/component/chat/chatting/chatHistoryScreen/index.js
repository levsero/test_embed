import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';

import HistoryLog from 'component/chat/chatting/HistoryLog';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { isFirefox, isIE } from 'utility/devices';
import {
  updateChatScreen,
  fetchConversationHistory
} from 'src/redux/modules/chat';
import {
  getHistoryLength,
  getHasMoreHistory,
  getHistoryRequestStatus
} from 'src/redux/modules/chat/chat-history-selectors';
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors';
import {
  getChatTitle,
} from 'src/redux/modules/selectors';
import { SCROLL_BOTTOM_THRESHOLD, HISTORY_REQUEST_STATUS } from 'constants/chat';
import { locals as styles } from './styles/index.scss';

const mapStateToProps = (state) => {
  return {
    historyLength: getHistoryLength(state),
    hasMoreHistory: getHasMoreHistory(state),
    historyRequestStatus: getHistoryRequestStatus(state),
    allAgents: chatSelectors.getAllAgents(state),
    visitor: chatSelectors.getChatVisitor(state),
    showAvatar: chatSelectors.getThemeShowAvatar(state),
    firstMessageTimestamp: chatSelectors.getFirstMessageTimestamp(state),
    title: getChatTitle(state),
  };
};

class ChatHistoryScreen extends Component {
  static propTypes = {
    historyLength: PropTypes.number,
    hasMoreHistory: PropTypes.bool,
    historyRequestStatus: PropTypes.string,
    isMobile: PropTypes.bool,
    allAgents: PropTypes.object.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    fetchConversationHistory: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    chatId: PropTypes.string,
    firstMessageTimestamp: PropTypes.number,
    fullscreen: PropTypes.bool
  };

  static defaultProps = {
    isMobile: false,
    fullscreen: false,
    concierges: [],
    historyLength: 0,
    chatLog: {},
    hasMoreHistory: false,
    historyRequestStatus: '',
    allAgents: {},
    fetchConversationHistory: () => {},
    hideZendeskLogo: false,
    chatId: '',
    firstMessageTimestamp: null,
    showContactDetails: () => {},
    markAsRead: () => {},
  };

  constructor(props) {
    super(props);

    this.scrollContainer = null;
    this.scrollHeightBeforeUpdate = null;
    this.scrollToBottomTimer = null;
  }

  componentDidMount() {
    const { historyLength } = this.props;
    const hasMessages = historyLength > 0;

    if (hasMessages) {
      this.scrollToBottom();
    }
  }

  componentWillUpdate(prevProps) {
    if (prevProps.historyRequestStatus === HISTORY_REQUEST_STATUS.PENDING &&
        this.props.historyRequestStatus === HISTORY_REQUEST_STATUS.DONE) {
      this.scrollHeightBeforeUpdate = this.scrollContainer.getScrollHeight();
    }
  }

  componentDidUpdate() {
    if (this.scrollContainer) {
      this.didUpdateFetchHistory();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollToBottomTimer);
  }

  didUpdateFetchHistory = () => {
    if (!this.scrollHeightBeforeUpdate) return;

    const scrollTop = this.scrollContainer.getScrollTop();
    const scrollHeight = this.scrollContainer.getScrollHeight();
    const lengthDifference = scrollHeight - this.scrollHeightBeforeUpdate;

    // When chat history is fetched, we record the scroll just before
    // the component updates in order to adjust the  scrollTop
    // by the difference in container height of pre and post update.
    if (lengthDifference !== 0) {
      this.scrollContainer.scrollTo(scrollTop + lengthDifference);
      this.scrollHeightBeforeUpdate = null;
    }
  }

  isScrollCloseToBottom = () => {
    return (this.scrollContainer)
      ? this.scrollContainer.getScrollBottom() < SCROLL_BOTTOM_THRESHOLD
      : false;
  }

  scrollToBottom = () => {
    this.scrollToBottomTimer = setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollToBottom();
      }
    }, 0);
  }

  handleChatScreenScrolled = () => {
    if (!this.scrollContainer) return;

    if (
      this.scrollContainer.isAtTop() &&
      this.props.hasMoreHistory &&
      this.props.historyRequestStatus !== HISTORY_REQUEST_STATUS.PENDING
    ) {
      this.props.fetchConversationHistory();
    }
  }

  renderHistoryFetching = () => {
    const { historyRequestStatus } = this.props;
    const duration = 300;
    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: 0,
    };
    const transitionStyles = {
      entering: { opacity: 0.9 },
      entered:  { opacity: 1 },
    };

    return this.props.historyRequestStatus ? (
      <div className={styles.historyFetchingContainer}>
        <Transition in={historyRequestStatus === HISTORY_REQUEST_STATUS.PENDING} timeout={0}>
          {(state) => (
            <div
              style={{ ...defaultStyle, ...transitionStyles[state] }}
              className={styles.historyFetchingText}>
              {i18n.t('embeddable_framework.chat.fetching_history')}
            </div>
          )}
        </Transition>
      </div>
    ) : null;
  }

  renderZendeskLogo = () => {
    const logoClasses = classNames(
      { [styles.zendeskLogoChatMobile]: this.props.isMobile }
    );

    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo} ${logoClasses}`}
        fullscreen={false}
        chatId={this.props.chatId}
        logoLink='chat'
      /> : null;
  }

  render = () => {
    const {
      isMobile,
      fullscreen,
      hideZendeskLogo
    } = this.props;
    const containerClasses = classNames({
      [styles.footerMarginWithLogo]: !hideZendeskLogo,
      [styles.footerMargin]: hideZendeskLogo,
      [styles.headerMargin]: true,
      [styles.scrollContainerMessagesContent]: isMobile,
      [styles.scrollContainerMessagesContentDesktop]: !isMobile,
      [styles.scrollContainerMobile]: isMobile,
      [styles.scrollBarFix]: isFirefox() || isIE()
    });
    const chatLogContainerClasses = classNames(
      styles.chatLogContainer,
      { [styles.chatLogContainerMobile]: isMobile }
    );

    return (
      <div>
        <ScrollContainer
          ref={(el) => { this.scrollContainer = el; }}
          title={'chat history'}
          onContentScrolled={this.handleChatScreenScrolled}
          containerClasses={containerClasses}
          fullscreen={fullscreen}
          isMobile={isMobile}>
          <div className={chatLogContainerClasses}>
            <HistoryLog
              isMobile={this.props.isMobile}
              showAvatar={this.props.showAvatar}
              agents={this.props.allAgents}
              firstMessageTimestamp={this.props.firstMessageTimestamp}
            />
            {this.renderHistoryFetching()}
          </div>
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    );
  }
}

const actionCreators = {
  updateChatScreen,
  fetchConversationHistory,
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(ChatHistoryScreen);

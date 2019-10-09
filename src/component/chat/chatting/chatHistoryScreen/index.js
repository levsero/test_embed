import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import Transition from 'react-transition-group/Transition'

import HistoryLog from 'component/chat/chatting/HistoryLog'
import { getScrollBottom } from 'component/container/ScrollContainer'
import { i18n } from 'service/i18n'
import { isFirefox, isIE } from 'utility/devices'
import { updateChatScreen, fetchConversationHistory } from 'src/redux/modules/chat'
import {
  getHistoryLength,
  getHasMoreHistory,
  getHistoryRequestStatus
} from 'src/redux/modules/chat/chat-history-selectors'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors'
import { getChatTitle } from 'src/redux/modules/selectors'
import { SCROLL_BOTTOM_THRESHOLD, HISTORY_REQUEST_STATUS } from 'constants/chat'
import { locals as styles } from './styles/index.scss'
import { onNextTick } from 'src/util/utils'
import { Widget, Header, Main, Footer } from 'components/Widget'

const mapStateToProps = state => {
  return {
    historyLength: getHistoryLength(state),
    hasMoreHistory: getHasMoreHistory(state),
    historyRequestStatus: getHistoryRequestStatus(state),
    allAgents: chatSelectors.getAllAgents(state),
    visitor: chatSelectors.getChatVisitor(state),
    showAvatar: chatSelectors.getThemeShowAvatar(state),
    firstMessageTimestamp: chatSelectors.getFirstMessageTimestamp(state),
    title: getChatTitle(state)
  }
}

class ChatHistoryScreen extends Component {
  static propTypes = {
    historyLength: PropTypes.number,
    hasMoreHistory: PropTypes.bool,
    historyRequestStatus: PropTypes.oneOf([
      HISTORY_REQUEST_STATUS.PENDING,
      HISTORY_REQUEST_STATUS.DONE,
      HISTORY_REQUEST_STATUS.FAIL
    ]),
    isMobile: PropTypes.bool,
    allAgents: PropTypes.object.isRequired,
    showAvatar: PropTypes.bool.isRequired,
    fetchConversationHistory: PropTypes.func,
    firstMessageTimestamp: PropTypes.number,
    title: PropTypes.string
  }

  static defaultProps = {
    isMobile: false,
    concierges: [],
    historyLength: 0,
    hasMoreHistory: false,
    historyRequestStatus: '',
    allAgents: {},
    fetchConversationHistory: () => {},
    firstMessageTimestamp: null,
    showContactDetails: () => {},
    markAsRead: () => {}
  }

  constructor(props) {
    super(props)

    this.scrollContainer = null
    this.scrollHeightBeforeUpdate = null
    this.scrollToBottomTimer = null
  }

  componentDidMount() {
    const { historyLength } = this.props
    const hasMessages = historyLength > 0

    if (hasMessages) {
      this.scrollToBottom()
    }
  }

  componentWillUpdate(prevProps) {
    if (
      prevProps.historyRequestStatus === HISTORY_REQUEST_STATUS.PENDING &&
      this.props.historyRequestStatus === HISTORY_REQUEST_STATUS.DONE
    ) {
      this.scrollHeightBeforeUpdate = this.scrollContainer.scrollHeight
    }
  }

  componentDidUpdate() {
    if (this.scrollContainer) {
      this.didUpdateFetchHistory()
    }
  }

  componentWillUnmount() {
    clearTimeout(this.scrollToBottomTimer)
  }

  didUpdateFetchHistory = () => {
    if (!this.scrollHeightBeforeUpdate) return

    const scrollTop = this.scrollContainer.scrollTop
    const scrollHeight = this.scrollContainer.scrollHeight
    const lengthDifference = scrollHeight - this.scrollHeightBeforeUpdate

    // When chat history is fetched, we record the scroll just before
    // the component updates in order to adjust the  scrollTop
    // by the difference in container height of pre and post update.
    if (lengthDifference !== 0) {
      this.scrollContainer.scrollTop = scrollTop + lengthDifference
      this.scrollHeightBeforeUpdate = null
    }
  }

  isScrollCloseToBottom = () => {
    return this.scrollContainer
      ? getScrollBottom(this.scrollContainer) < SCROLL_BOTTOM_THRESHOLD
      : false
  }

  scrollToBottom = () => {
    this.scrollToBottomTimer = onNextTick(() => {
      if (this.scrollContainer) {
        this.scrollContainer.scrollTop = this.scrollContainer.scrollHeight
      }
    })
  }

  handleChatScreenScrolled = () => {
    if (!this.scrollContainer) return

    if (
      this.scrollContainer.scrollTop === 0 &&
      this.props.hasMoreHistory &&
      this.props.historyRequestStatus !== HISTORY_REQUEST_STATUS.PENDING
    ) {
      this.props.fetchConversationHistory()
    }
  }

  renderHistoryFetching = () => {
    const { historyRequestStatus } = this.props
    const duration = 300
    const defaultStyle = {
      transition: `opacity ${duration}ms ease-in-out`,
      opacity: 0
    }
    const transitionStyles = {
      entering: { opacity: 0.9 },
      entered: { opacity: 1 }
    }

    return this.props.historyRequestStatus ? (
      <div className={styles.historyFetchingContainer}>
        <Transition in={historyRequestStatus === HISTORY_REQUEST_STATUS.PENDING} timeout={0}>
          {state => (
            <div
              style={{ ...defaultStyle, ...transitionStyles[state] }}
              className={styles.historyFetchingText}
            >
              {i18n.t('embeddable_framework.chat.fetching_history')}
            </div>
          )}
        </Transition>
      </div>
    ) : null
  }

  render = () => {
    const { isMobile, title } = this.props

    const chatLogContainerClasses = classNames(styles.chatLogContainer, {
      [styles.chatLogContainerMobile]: isMobile
    })

    return (
      <Widget>
        <Header title={title} />
        <Main
          ref={el => {
            this.scrollContainer = el
          }}
          onScroll={this.handleChatScreenScrolled}
          className={classNames({
            [styles.scrollBarFix]: isFirefox() || isIE()
          })}
        >
          <div className={chatLogContainerClasses}>
            <HistoryLog
              isMobile={this.props.isMobile}
              showAvatar={this.props.showAvatar}
              agents={this.props.allAgents}
              firstMessageTimestamp={this.props.firstMessageTimestamp}
            />
            {this.renderHistoryFetching()}
          </div>
        </Main>
        <Footer />
      </Widget>
    )
  }
}

const actionCreators = {
  updateChatScreen,
  fetchConversationHistory
}

export default connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(ChatHistoryScreen)
export { ChatHistoryScreen as Component }

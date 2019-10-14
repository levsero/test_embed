import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'

import { i18n } from 'service/i18n'
import { Avatar } from 'component/Avatar'
import { RatingGroup } from 'component/chat/rating/RatingGroup'
import { TEST_IDS } from 'src/constants/shared'

import { locals as styles } from './ChatHeader.scss'

export class ChatHeader extends Component {
  static propTypes = {
    concierges: PropTypes.array,
    updateRating: PropTypes.func,
    rating: PropTypes.string,
    showRating: PropTypes.bool,
    showAvatar: PropTypes.bool,
    showTitle: PropTypes.bool,
    onAgentDetailsClick: PropTypes.func,
    agentsActive: PropTypes.bool
  }

  static defaultProps = {
    updateRating: () => {},
    rating: null,
    concierges: [{}],
    showRating: false,
    showAvatar: true,
    showTitle: true,
    agentsActive: false
  }

  renderAvatars = concierges => {
    return concierges.map((details, index) => {
      const avatarPath = details.avatar_path ? details.avatar_path : ''

      return (
        <Avatar
          key={index}
          className={styles.avatar}
          src={avatarPath}
          fallbackIcon="Icon--avatar"
        />
      )
    })
  }

  renderOverflow = overflowCount => {
    if (overflowCount <= 0) return

    return (
      <div className={`${styles.avatarOverflow} ${styles.avatar}`}>
        <span className={styles.avatarOverflowText}>+{overflowCount}</span>
      </div>
    )
  }

  renderAvatarContainer = () => {
    const { concierges } = this.props
    const avatarSize = concierges.length
    const overflowCount = avatarSize > 3 ? Math.min(avatarSize - 2, 99) : 0
    const avatars = concierges.slice(0, overflowCount ? 2 : 3)

    return (
      <div className={styles.avatarContainer}>
        {this.renderAvatars(avatars)}
        {this.renderOverflow(overflowCount)}
      </div>
    )
  }

  renderRatingButtons = () => {
    return (
      <RatingGroup
        className={styles.ratingGroup}
        updateRating={this.props.updateRating}
        rtl={i18n.isRTL()}
        rating={this.props.rating}
      />
    )
  }

  textContainerStyle = () => {
    const { showAvatar, showTitle } = this.props

    if (!showTitle) {
      return { visibility: 'hidden' }
    }

    if (!showAvatar) {
      return null
    }

    return i18n.isRTL() ? { paddingRight: '12px' } : { paddingLeft: '12px' }
  }

  renderTextContainer = () => {
    const { concierges } = this.props
    const defaultTitleText = i18n.t('embeddable_framework.chat.header.default.title')
    const titleText = _.get(concierges[0], 'display_name') || defaultTitleText

    return (
      <div
        data-testid={TEST_IDS.CHAT_HEADER_TEXT_CONTAINER}
        className={styles.textContainer}
        style={this.textContainerStyle()}
      >
        <h2 className={styles.title} data-testid={TEST_IDS.CHAT_HEADER_TITLE}>
          {titleText}
        </h2>
        {this.renderSubText()}
      </div>
    )
  }

  renderSubText = () => {
    const { concierges } = this.props
    const defaultSubText = i18n.t('embeddable_framework.chat.header.by_line')
    const subText = _.get(concierges[0], 'title') || defaultSubText

    return (
      <div className={styles.subTextContainer} data-testid={TEST_IDS.CHAT_HEADER_SUBTEXT}>
        {subText}
      </div>
    )
  }

  render = () => {
    const { showTitle, showAvatar, showRating, onAgentDetailsClick, agentsActive } = this.props
    const ratingButtons = showRating ? this.renderRatingButtons() : null
    const avatar = showAvatar ? this.renderAvatarContainer() : null
    const textContainer = this.renderTextContainer()
    const agentDetailsClasses = classNames(styles.agentDetails, styles.button, {
      [styles.clickable]: !!onAgentDetailsClick && agentsActive
    })

    if (!showAvatar && !showTitle && !showRating) {
      return null
    }

    const AgentInfo = agentsActive ? 'button' : 'div'

    return (
      <div className={styles.container} data-testid={TEST_IDS.HEADER_CONTAINER}>
        <AgentInfo
          className={agentDetailsClasses}
          onClick={agentsActive ? onAgentDetailsClick : undefined}
        >
          {avatar}
          {textContainer}
        </AgentInfo>
        {ratingButtons}
      </div>
    )
  }
}

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import _ from 'lodash'
import { Tooltip } from '@zendeskgarden/react-tooltips'

import { i18n } from 'service/i18n'
import { Avatar } from 'component/Avatar'
import RatingGroup from 'src/embeds/chat/components/RatingGroup'
import { TEST_IDS } from 'src/constants/shared'
import { AvatarContainer, Subtext, Text, Title } from './ChatHeaderStyles'
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
      <AvatarContainer>
        {this.renderAvatars(avatars)}
        {this.renderOverflow(overflowCount)}
      </AvatarContainer>
    )
  }

  renderRatingButtons = () => {
    return <RatingGroup updateRating={this.props.updateRating} rating={this.props.rating} />
  }

  renderTextContainer = () => {
    const { concierges, showTitle, showAvatar } = this.props
    const defaultTitleText = i18n.t('embeddable_framework.chat.header.default.title')
    const titleText = _.get(concierges[0], 'display_name') || defaultTitleText

    if (!showTitle) return null

    return (
      <Text
        data-testid={TEST_IDS.CHAT_HEADER_TEXT_CONTAINER}
        showTitle={showTitle}
        showAvatar={showAvatar}
      >
        <Title data-testid={TEST_IDS.CHAT_HEADER_TITLE}>{titleText}</Title>
        {this.renderSubText()}
      </Text>
    )
  }

  renderSubText = () => {
    const { concierges, showTitle } = this.props
    const defaultSubText = i18n.t('embeddable_framework.chat.header.by_line')
    const subText = _.get(concierges[0], 'title') || defaultSubText
    const textContainer = (
      <Subtext data-testid={TEST_IDS.CHAT_HEADER_SUBTEXT} tooltip={subText} tabIndex="-1">
        {subText}
      </Subtext>
    )

    if (!showTitle) {
      return textContainer
    }

    return (
      <Tooltip size="medium" trigger={textContainer}>
        {subText}
      </Tooltip>
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

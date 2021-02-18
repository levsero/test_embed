import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { Tooltip } from '@zendeskgarden/react-tooltips'
import RatingGroup from 'src/embeds/chat/components/RatingGroup'
import { TEST_IDS, ICONS } from 'src/constants/shared'
import { sendChatRating } from 'src/redux/modules/chat'
import {
  getProfileConfig,
  getShowRatingButtons,
  getCurrentConcierges,
} from 'src/redux/modules/selectors'
import { getChatRating } from 'src/redux/modules/chat/chat-selectors'
import {
  Container,
  AvatarContainer,
  AgentInfo,
  Overflow,
  OverflowText,
  Subtext,
  Text,
  Title,
  Avatar,
  TooltipWrapper,
} from './styles'

const ChatHeader = ({
  showAvatar,
  showTitle,
  showRating,
  onAgentDetailsClick,
  agentsActive,
  concierges,
  updateRating,
  rating,
}) => {
  const translate = useTranslate()
  if (!showAvatar && !showTitle && !showRating) {
    return null
  }

  const avatarSize = concierges.length
  const overflowCount = avatarSize > 3 ? Math.min(avatarSize - 2, 99) : 0
  const avatars = concierges.slice(0, overflowCount ? 2 : 3)

  const defaultTitleText = translate('embeddable_framework.chat.header.default.title')
  const titleText = concierges[0].display_name || defaultTitleText

  const defaultSubText = translate('embeddable_framework.chat.header.by_line')
  const subText = concierges[0].title || defaultSubText

  return (
    <Container data-testid={TEST_IDS.HEADER_CONTAINER}>
      <AgentInfo
        clickable={Boolean(onAgentDetailsClick && agentsActive)}
        onClick={agentsActive ? onAgentDetailsClick : undefined}
        as={agentsActive ? 'button' : 'div'}
      >
        {showAvatar && (
          <AvatarContainer>
            {avatars.map((details, index) => {
              const avatarPath = details.avatar_path || ''

              return (
                <Avatar
                  key={avatarPath}
                  index={index}
                  src={avatarPath}
                  fallbackIcon={ICONS.AVATAR}
                />
              )
            })}
            {overflowCount > 0 && (
              <Overflow>
                <OverflowText>+{overflowCount}</OverflowText>
              </Overflow>
            )}
          </AvatarContainer>
        )}
        {showTitle && (
          <Text
            data-testid={TEST_IDS.CHAT_HEADER_TEXT_CONTAINER}
            showTitle={showTitle}
            showAvatar={showAvatar}
          >
            <Title data-testid={TEST_IDS.CHAT_HEADER_TITLE}>{titleText}</Title>
            <TooltipWrapper>
              <Tooltip size="medium" style={{ display: 'block' }} content={subText}>
                <Subtext data-testid={TEST_IDS.CHAT_HEADER_SUBTEXT} tooltip={subText} tabIndex="-1">
                  {subText}
                </Subtext>
              </Tooltip>
            </TooltipWrapper>
          </Text>
        )}
      </AgentInfo>
      {showRating && <RatingGroup updateRating={updateRating} rating={rating} />}
    </Container>
  )
}

ChatHeader.propTypes = {
  concierges: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string,
      title: PropTypes.string,
      avatarPath: PropTypes.string,
      avatarData: PropTypes.string,
    })
  ),
  updateRating: PropTypes.func,
  rating: PropTypes.string,
  showRating: PropTypes.bool,
  showAvatar: PropTypes.bool,
  showTitle: PropTypes.bool,
  onAgentDetailsClick: PropTypes.func,
  agentsActive: PropTypes.bool,
}

ChatHeader.defaultProps = {
  updateRating: () => {},
  rating: null,
  concierges: [{}],
  showRating: false,
  showAvatar: true,
  showTitle: true,
  agentsActive: false,
}

const actionCreators = {
  updateRating: sendChatRating,
}

const mapStateToProps = (state) => ({
  showRating: getShowRatingButtons(state),
  showTitle: getProfileConfig(state).title,
  showAvatar: getProfileConfig(state).avatar,
  rating: getChatRating(state).value,
  concierges: getCurrentConcierges(state),
})

const connectedComponent = connect(mapStateToProps, actionCreators)(ChatHeader)

export { connectedComponent as default, ChatHeader as Component }

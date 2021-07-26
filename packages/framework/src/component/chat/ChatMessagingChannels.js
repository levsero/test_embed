import PropTypes from 'prop-types'
import { withTheme } from 'styled-components'
import { TEST_IDS } from 'src/constants/shared'
import useTranslate from 'src/hooks/useTranslate'
import { renderLabel } from 'src/util/fields'
import {
  ChannelIcon,
  ButtonsContainer,
  Container,
  MessengerIcon,
  TwitterIcon,
} from './ChatMessagingChannelsStyles'

const ChatMessagingChannels = ({ channels: { facebook, twitter }, theme: { isMobile } }) => {
  const translate = useTranslate()

  const { allowed: messengerAllowed, page_id: messengerPageId } = facebook
  const { allowed: twitterAllowed, page_id: twitterPageId } = twitter

  if (!messengerAllowed && !twitterAllowed) {
    return null
  }

  return (
    <Container>
      {renderLabel('label', translate('embeddable_framework.chat.messagingChannels.title'), true)}
      <ButtonsContainer>
        {messengerAllowed && (
          <ChannelIcon
            href={`https://m.me/${messengerPageId}`}
            target="_blank"
            rel="noopener noreferrer"
            isMobile={isMobile ? 'true' : null}
          >
            <MessengerIcon
              mobile={isMobile ? 'true' : null}
              data-testid={TEST_IDS.ICON_MESSENGER}
            />
          </ChannelIcon>
        )}
        {twitterAllowed && (
          <ChannelIcon
            href={`https://twitter.com/messages/compose?recipient_id=${twitterPageId}`}
            target="_blank"
            rel="noopener noreferrer"
            isMobile={isMobile ? 'true' : null}
          >
            <TwitterIcon mobile={isMobile ? 'true' : null} data-testid={TEST_IDS.ICON_TWITTER} />
          </ChannelIcon>
        )}
      </ButtonsContainer>
    </Container>
  )
}

ChatMessagingChannels.propTypes = {
  channels: PropTypes.shape({
    facebook: PropTypes.shape({
      allowed: PropTypes.bool,
      page_id: PropTypes.string,
    }),
    twitter: PropTypes.shape({
      allowed: PropTypes.bool,
      page_id: PropTypes.string,
    }),
  }),
  theme: PropTypes.shape({ isMobile: PropTypes.bool }),
}

const themedComponent = withTheme(ChatMessagingChannels)

export default themedComponent

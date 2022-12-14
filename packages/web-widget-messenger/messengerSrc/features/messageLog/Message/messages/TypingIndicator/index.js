import PropTypes from 'prop-types'
import { MessageBubble, OtherParticipantLayout } from '@zendesk/conversation-components'
import useTranslate from 'messengerSrc/features/i18n/useTranslate'
import getMessageShape from 'messengerSrc/features/messageLog/utils/getMessageShape'
import { DotLoader } from './styles'

const TypingIndicator = ({
  message: { avatarUrl, name, isFirstInGroup, isLastInGroup, isFirstMessageInAuthorGroup, _id },
}) => {
  const translate = useTranslate()
  return (
    <OtherParticipantLayout
      avatar={avatarUrl}
      isFirstInGroup={isFirstInGroup}
      isReceiptVisible={false}
      label={isFirstMessageInAuthorGroup ? name : undefined}
    >
      <MessageBubble
        isPrimaryParticipant={false}
        shape={getMessageShape(isFirstInGroup, isLastInGroup)}
      >
        <DotLoader
          aria-label={translate('embeddable_framework.messenger.typing_indicator.single', { name })}
        />
      </MessageBubble>
    </OtherParticipantLayout>
  )
}

TypingIndicator.propTypes = {
  message: PropTypes.shape({
    avatarUrl: PropTypes.string,
    name: PropTypes.string,
  }),
}
export default TypingIndicator

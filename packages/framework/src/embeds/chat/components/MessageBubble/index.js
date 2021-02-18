import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Linkify from 'react-linkify'

import useTranslate from 'src/hooks/useTranslate'
import { TEST_IDS } from 'constants/shared'
import { Container, MessageContainer, Message, TranslateLink, MessageBubbleLink } from './styles'
import MessageOptions from './MessageOptions'

const MessageBubble = ({ message, translatedMessage, isAgent, options = [], onOptionSelect }) => {
  const translate = useTranslate()
  const [showTranslatedMessage, setShowTranslatedMessage] = useState(true)

  const messageToDisplay = (showTranslatedMessage ? translatedMessage : message) || message

  return (
    <Container data-testid={isAgent ? TEST_IDS.CHAT_MSG_AGENT : TEST_IDS.CHAT_MSG_USER}>
      <MessageContainer isAgent={isAgent} hasOptions={options.length > 0}>
        <Message>
          <Linkify properties={{ target: '_blank', link: true }} component={MessageBubbleLink}>
            {messageToDisplay}
          </Linkify>
        </Message>

        {translatedMessage && (
          <TranslateLink
            data-testid={TEST_IDS.TRANSLATE_LINK}
            onClick={() => {
              setShowTranslatedMessage(!showTranslatedMessage)
            }}
          >
            {showTranslatedMessage
              ? translate('embeddable_framework.chat.show_original')
              : translate('embeddable_framework.chat.show_translated')}
          </TranslateLink>
        )}
      </MessageContainer>
      {options.length > 0 && <MessageOptions onSelect={onOptionSelect} options={options} />}
    </Container>
  )
}

MessageBubble.propTypes = {
  message: PropTypes.string,
  translatedMessage: PropTypes.string,
  isAgent: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.string),
  onOptionSelect: PropTypes.func.isRequired,
}

export default MessageBubble

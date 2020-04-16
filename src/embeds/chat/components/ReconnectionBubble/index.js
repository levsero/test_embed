import React from 'react'
import { Spinner } from '@zendeskgarden/react-loaders'
import useTranslate from 'src/hooks/useTranslate'
import { Container, Bubble, Message } from './styles'

const ReconnectionBubble = () => {
  const translate = useTranslate()

  return (
    <Container>
      <Bubble>
        <Message role="status" aria-live="polite">
          {translate('embeddable_framework.chat.reconnecting')}{' '}
        </Message>
        <Spinner />
      </Bubble>
    </Container>
  )
}

export default ReconnectionBubble

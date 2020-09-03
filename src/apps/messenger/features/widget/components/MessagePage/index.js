import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { KEY_CODES } from '@zendeskgarden/react-selection'

import Header from 'src/apps/messenger/features/header'
import Footer from 'src/apps/messenger/features/footer'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { widgetClosed } from 'src/apps/messenger/store/visibility'

import { Container } from './styles'
import MessageLog from 'src/apps/messenger/features/messageLog'

const MessagePage = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  const isFullScreen = useSelector(getIsFullScreen)

  return (
    <Container
      isFullScreen={isFullScreen}
      ref={ref}
      onKeyDown={event => {
        // The focus jail does not pick up onKeyDown if not used at least once.

        if (event.keyCode === KEY_CODES.ESCAPE) {
          dispatch(widgetClosed())
        }
      }}
      role="presentation"
    >
      <Header />
      <MessageLog />
      <Footer />
    </Container>
  )
})

export default MessagePage

import React from 'react'
import { useSelector } from 'react-redux'

import Header from 'src/apps/messenger/features/header'
import Footer from 'src/apps/messenger/features/footer'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'

import { Container } from './styles'
import MessageLog from 'src/apps/messenger/features/messageLog'

const MessagePage = React.forwardRef((_props, ref) => {
  const isFullScreen = useSelector(getIsFullScreen)

  return (
    <Container
      isFullScreen={isFullScreen}
      ref={ref}
      onKeyDown={() => {
        // The focus jail does not pick up onKeyDown if not used at least once.
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

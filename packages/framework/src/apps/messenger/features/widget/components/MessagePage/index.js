import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { KEY_CODES } from '@zendeskgarden/react-selection'

import Header from 'src/apps/messenger/features/header'
import ConnectionStatusBanner from 'src/apps/messenger/features/onlineStatus'
import Footer from 'src/apps/messenger/features/footer'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { widgetClosed } from 'src/apps/messenger/store/visibility'

import { Container } from './styles'
import MessageLog from 'src/apps/messenger/features/messageLog'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { hasExistingConversation } from 'src/apps/messenger/api/sunco'
import { startNewConversation } from 'src/apps/messenger/features/suncoConversation/store'
import useDisableAnimationProps from 'src/apps/messenger/features/sunco-components/Animated/useDisableAnimationProps'

const MessagePage = React.forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  const isFullScreen = useSelector(getIsFullScreen)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const disableAnimationProps = useDisableAnimationProps()

  useEffect(() => {
    if (!hasExistingConversation()) {
      dispatch(startNewConversation())
    }
  }, [])

  return (
    <Container
      {...disableAnimationProps}
      isFullScreen={isFullScreen}
      isLauncherVisible={isLauncherVisible}
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
      <ConnectionStatusBanner />
      <MessageLog />
      <Footer />
    </Container>
  )
})

export default MessagePage

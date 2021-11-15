import { forwardRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import useDisableAnimationProps from 'messengerSrc/features/animations/useDisableAnimationProps'
import Footer from 'messengerSrc/features/footer'
import Header from 'messengerSrc/features/header'
import { getIsLauncherVisible } from 'messengerSrc/features/launcher/store'
import MessageLog from 'messengerSrc/features/messageLog'
import ConnectionStatusBanner from 'messengerSrc/features/onlineStatus'
import { getIsFullScreen } from 'messengerSrc/features/responsiveDesign/store'
import {
  getConversationStatus,
  startConversation,
} from 'messengerSrc/features/suncoConversation/store'
import ConversationConnectionStatus from 'messengerSrc/features/widget/components/MessagePage/ConversationConnectionStatus'
import { widgetClosed } from 'messengerSrc/store/visibility'
import { Container } from './styles'

const MessagePage = forwardRef((_props, ref) => {
  const dispatch = useDispatch()
  const isFullScreen = useSelector(getIsFullScreen)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const disableAnimationProps = useDisableAnimationProps()
  const conversationStatus = useSelector(getConversationStatus)

  useEffect(() => {
    if (conversationStatus === 'not-connected') {
      dispatch(startConversation())
    }
  }, [conversationStatus])

  return (
    <Container
      {...disableAnimationProps}
      isFullScreen={isFullScreen}
      isLauncherVisible={isLauncherVisible}
      ref={ref}
      onKeyDown={(event) => {
        // The focus jail does not pick up onKeyDown if not used at least once.

        if (event.keyCode === KEY_CODES.ESCAPE) {
          dispatch(widgetClosed())
        }
      }}
      role="presentation"
    >
      <Header />
      <ConnectionStatusBanner />
      <ConversationConnectionStatus>
        <MessageLog />
        <Footer />
      </ConversationConnectionStatus>
    </Container>
  )
})

export default MessagePage

import { forwardRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { KEY_CODES } from '@zendeskgarden/react-selection'
import useDisableAnimationProps from 'src/apps/messenger/features/animations/useDisableAnimationProps'
import Footer from 'src/apps/messenger/features/footer'
import Header from 'src/apps/messenger/features/header'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import MessageLog from 'src/apps/messenger/features/messageLog'
import ConnectionStatusBanner from 'src/apps/messenger/features/onlineStatus'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import {
  getConversationStatus,
  startConversation,
} from 'src/apps/messenger/features/suncoConversation/store'
import ConversationConnectionStatus from 'src/apps/messenger/features/widget/components/MessagePage/ConversationConnectionStatus'
import { widgetClosed } from 'src/apps/messenger/store/visibility'
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

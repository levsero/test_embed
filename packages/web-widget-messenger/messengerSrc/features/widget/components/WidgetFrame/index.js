import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Frame from 'src/framework/components/Frame'
import { scrollLockHostPage } from 'src/util/scrollHacks'
import useTranslate from 'messengerSrc/features/i18n/useTranslate'
import { getIsFullScreen } from 'messengerSrc/features/responsiveDesign/store'
import ThemeProvider from 'messengerSrc/features/themeProvider'
import FrameAnimation from 'messengerSrc/features/widget/components/WidgetFrame/FrameAnimation'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'

const MessengerFrame = ({ children }) => {
  const translate = useTranslate()
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const isFullScreen = useSelector(getIsFullScreen)

  useEffect(() => {
    scrollLockHostPage(isFullScreen && isWidgetOpen)
  }, [isFullScreen, isWidgetOpen])

  return (
    <FrameAnimation>
      {(state, styles) => (
        <Frame
          title={translate('embeddable_framework.messenger.frame.title')}
          hidden={state === 'exited'}
          style={styles}
        >
          <ThemeProvider>{children}</ThemeProvider>
        </Frame>
      )}
    </FrameAnimation>
  )
}
MessengerFrame.propTypes = {
  children: PropTypes.node,
}

export default MessengerFrame

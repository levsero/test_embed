import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import bedrockCSS from '@zendeskgarden/css-bedrock'
import { ThemeProvider as SuncoThemeProvider } from '@zendesk/conversation-components'
import { CurrentFrameConsumer } from 'src/framework/components/Frame'
import { getMessengerColors } from 'src/apps/messenger/features/themeProvider/store'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { baseFontSize, baseFontSizeFullScreen } from 'src/apps/messenger/constants'
import { createGlobalStyle } from 'styled-components'
import i18n from 'src/framework/services/i18n'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

const GlobalStyles = createGlobalStyle`
  ${bedrockCSS}

  html {
     overflow-y: hidden;
     font-size: initial;
  }
`

const ThemeProvider = ({ children }) => {
  useTranslate()
  const messengerColors = useSelector(getMessengerColors)
  const isFullScreen = useSelector(getIsFullScreen)
  const currentBaseFontSize = isFullScreen ? baseFontSizeFullScreen : baseFontSize

  return (
    <CurrentFrameConsumer>
      {frame => (
        <SuncoThemeProvider
          currentFrame={frame}
          primaryColor={messengerColors.primary}
          messageColor={messengerColors.message}
          actionColor={messengerColors.action}
          baseFontSize={currentBaseFontSize}
          rtl={i18n.isRTL()}
        >
          <>
            <GlobalStyles />

            {children}
          </>
        </SuncoThemeProvider>
      )}
    </CurrentFrameConsumer>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node
}

export default ThemeProvider

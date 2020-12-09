import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { createGlobalStyle } from 'styled-components'
import bedrockCSS from '@zendeskgarden/css-bedrock'
import SuncoThemeProvider from 'src/apps/messenger/features/sunco-components/ThemeProvider'
import { i18n } from 'service/i18n'
import { CurrentFrameConsumer } from 'src/framework/components/Frame'
import useTranslate from 'src/hooks/useTranslate'
import { getMessengerColors } from 'src/apps/messenger/features/themeProvider/store'
import { getIsFullScreen } from 'src/apps/messenger/features/responsiveDesign/store'
import { baseFontSize, baseFontSizeFullScreen } from 'src/apps/messenger/constants'

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
          document={frame.document}
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
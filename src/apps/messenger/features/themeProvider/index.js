import React from 'react'
import PropTypes from 'prop-types'
import { DEFAULT_THEME, ThemeProvider as GardenThemeProvider } from '@zendeskgarden/react-theming'
import { i18n } from 'service/i18n'
import { CurrentFrameConsumer } from 'src/framework/components/Frame'
import useTranslate from 'src/hooks/useTranslate'

const ThemeProvider = ({ children }) => {
  useTranslate()

  return (
    <CurrentFrameConsumer>
      {frame => (
        <GardenThemeProvider
          theme={{
            ...DEFAULT_THEME,
            document: frame.document,
            rtl: i18n.isRTL()
          }}
        >
          {children}
        </GardenThemeProvider>
      )}
    </CurrentFrameConsumer>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node
}

export default ThemeProvider

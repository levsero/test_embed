import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { createGlobalStyle } from 'styled-components'
import bedrockCSS from '@zendeskgarden/css-bedrock'
import { DEFAULT_THEME, ThemeProvider as GardenThemeProvider } from '@zendeskgarden/react-theming'
import { i18n } from 'service/i18n'
import { CurrentFrameConsumer } from 'src/framework/components/Frame'
import useTranslate from 'src/hooks/useTranslate'
import { getMessengerColors } from 'src/apps/messenger/features/themeProvider/store'
import { rem } from 'polished'
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
        <GardenThemeProvider
          theme={{
            ...DEFAULT_THEME,
            document: frame.document,
            rtl: i18n.isRTL(),
            messenger: {
              baseFontSize: currentBaseFontSize,
              colors: messengerColors,
              fontSizes: {
                xs: rem(DEFAULT_THEME.fontSizes.xs, currentBaseFontSize),
                sm: rem(DEFAULT_THEME.fontSizes.sm, currentBaseFontSize),
                md: rem(DEFAULT_THEME.fontSizes.md, currentBaseFontSize),
                sixteen: rem('16px', currentBaseFontSize),
                lg: rem(DEFAULT_THEME.fontSizes.lg, currentBaseFontSize),
                xl: rem(DEFAULT_THEME.fontSizes.xl, currentBaseFontSize),
                xxl: rem(DEFAULT_THEME.fontSizes.xxl, currentBaseFontSize),
                xxxl: rem(DEFAULT_THEME.fontSizes.xxxl, currentBaseFontSize)
              },
              space: {
                xxxs: rem('2px', currentBaseFontSize),
                xxs: rem(DEFAULT_THEME.space.xxs, currentBaseFontSize),
                xs: rem(DEFAULT_THEME.space.xs, currentBaseFontSize),
                sm: rem(DEFAULT_THEME.space.sm, currentBaseFontSize),
                sixteen: rem('16px', currentBaseFontSize),
                md: rem(DEFAULT_THEME.space.md, currentBaseFontSize),
                lg: rem(DEFAULT_THEME.space.lg, currentBaseFontSize),
                xl: rem(DEFAULT_THEME.space.xl, currentBaseFontSize),
                xxl: rem(DEFAULT_THEME.space.xxl, currentBaseFontSize),
                xxxl: rem(DEFAULT_THEME.space.xxxl, currentBaseFontSize),
                imageHeight: rem('146px', currentBaseFontSize),
                imageWidth: rem('264px', currentBaseFontSize)
              },
              lineHeights: {
                sm: rem(DEFAULT_THEME.lineHeights.sm, currentBaseFontSize),
                md: rem(DEFAULT_THEME.lineHeights.md, currentBaseFontSize),
                lg: rem(DEFAULT_THEME.lineHeights.lg, currentBaseFontSize),
                xl: rem(DEFAULT_THEME.lineHeights.xl, currentBaseFontSize),
                xxl: rem(DEFAULT_THEME.lineHeights.xxl, currentBaseFontSize)
              },
              iconSizes: {
                sm: rem(DEFAULT_THEME.iconSizes.sm, currentBaseFontSize),
                md: rem(DEFAULT_THEME.iconSizes.md, currentBaseFontSize),
                lg: rem(DEFAULT_THEME.iconSizes.lg, currentBaseFontSize),
                xl: rem('32px', currentBaseFontSize)
              },
              borderRadii: {
                textMessage: rem('20px', currentBaseFontSize)
              }
            }
          }}
        >
          <>
            <GlobalStyles />

            {children}
          </>
        </GardenThemeProvider>
      )}
    </CurrentFrameConsumer>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node
}

export default ThemeProvider

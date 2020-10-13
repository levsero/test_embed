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

const GlobalStyles = createGlobalStyle`
  ${bedrockCSS}

  html {
     overflow-y: hidden;
     font-size: initial;
  }
`

export const baseFontSize = '16px'

const ThemeProvider = ({ children }) => {
  useTranslate()
  const messengerColors = useSelector(getMessengerColors)

  return (
    <CurrentFrameConsumer>
      {frame => (
        <GardenThemeProvider
          theme={{
            ...DEFAULT_THEME,
            document: frame.document,
            rtl: i18n.isRTL(),
            messenger: {
              colors: messengerColors,
              fontSizes: {
                xs: rem(DEFAULT_THEME.fontSizes.xs, baseFontSize),
                sm: rem(DEFAULT_THEME.fontSizes.sm, baseFontSize),
                md: rem(DEFAULT_THEME.fontSizes.md, baseFontSize),
                sixteen: rem('16px', baseFontSize),
                lg: rem(DEFAULT_THEME.fontSizes.lg, baseFontSize),
                xl: rem(DEFAULT_THEME.fontSizes.xl, baseFontSize),
                xxl: rem(DEFAULT_THEME.fontSizes.xxl, baseFontSize),
                xxxl: rem(DEFAULT_THEME.fontSizes.xxxl, baseFontSize)
              },
              space: {
                xxxs: rem('2px', baseFontSize),
                xxs: rem(DEFAULT_THEME.space.xxs, baseFontSize),
                xs: rem(DEFAULT_THEME.space.xs, baseFontSize),
                sm: rem(DEFAULT_THEME.space.sm, baseFontSize),
                sixteen: rem('16px', baseFontSize),
                md: rem(DEFAULT_THEME.space.md, baseFontSize),
                lg: rem(DEFAULT_THEME.space.lg, baseFontSize),
                xl: rem(DEFAULT_THEME.space.xl, baseFontSize),
                xxl: rem(DEFAULT_THEME.space.xxl, baseFontSize),
                imageHeight: rem('146px', baseFontSize),
                imageWidth: rem('264px', baseFontSize),
                xxxl: rem(DEFAULT_THEME.space.xxxl, baseFontSize)
              },
              lineHeights: {
                sm: rem(DEFAULT_THEME.lineHeights.sm, baseFontSize),
                md: rem(DEFAULT_THEME.lineHeights.md, baseFontSize),
                lg: rem(DEFAULT_THEME.lineHeights.lg, baseFontSize),
                xl: rem(DEFAULT_THEME.lineHeights.xl, baseFontSize),
                xxl: rem(DEFAULT_THEME.lineHeights.xxl, baseFontSize)
              },
              iconSizes: {
                sm: rem(DEFAULT_THEME.iconSizes.sm, baseFontSize),
                md: rem(DEFAULT_THEME.iconSizes.md, baseFontSize),
                lg: rem(DEFAULT_THEME.iconSizes.lg, baseFontSize),
                xl: rem('32px', baseFontSize)
              },
              borderRadii: {
                textMessage: rem('20px', baseFontSize)
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

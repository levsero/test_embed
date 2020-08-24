import React from 'react'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'
import { DEFAULT_THEME, ThemeProvider as GardenThemeProvider } from '@zendeskgarden/react-theming'
import { i18n } from 'service/i18n'
import { CurrentFrameConsumer } from 'src/framework/components/Frame'
import useTranslate from 'src/hooks/useTranslate'
import { getMessengerColors } from 'src/apps/messenger/features/themeProvider/reducer/messengerColors'
import { rem } from 'polished'

const baseFontSize = DEFAULT_THEME.fontSizes.md // 14px
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
              ...messengerColors,
              fontSizes: {
                xs: rem(DEFAULT_THEME.fontSizes.xs, baseFontSize),
                sm: rem(DEFAULT_THEME.fontSizes.sm, baseFontSize),
                md: rem(DEFAULT_THEME.fontSizes.md, baseFontSize),
                lg: rem(DEFAULT_THEME.fontSizes.lg, baseFontSize),
                xl: rem(DEFAULT_THEME.fontSizes.xl, baseFontSize),
                xxl: rem(DEFAULT_THEME.fontSizes.xxl, baseFontSize),
                xxxl: rem(DEFAULT_THEME.fontSizes.xxxl, baseFontSize)
              },
              space: {
                xxs: rem(DEFAULT_THEME.space.xxs, baseFontSize),
                xs: rem(DEFAULT_THEME.space.xs, baseFontSize),
                sm: rem(DEFAULT_THEME.space.sm, baseFontSize),
                md: rem(DEFAULT_THEME.space.md, baseFontSize),
                lg: rem(DEFAULT_THEME.space.lg, baseFontSize),
                xl: rem(DEFAULT_THEME.space.xl, baseFontSize),
                xxl: rem(DEFAULT_THEME.space.xxl, baseFontSize)
              },
              lineHeights: {
                sm: rem(DEFAULT_THEME.lineHeights.sm, baseFontSize),
                md: rem(DEFAULT_THEME.lineHeights.md, baseFontSize),
                lg: rem(DEFAULT_THEME.lineHeights.lg, baseFontSize),
                xl: rem(DEFAULT_THEME.lineHeights.xl, baseFontSize),
                xxl: rem(DEFAULT_THEME.lineHeights.xxl, baseFontSize)
              }
            }
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

import { rem } from 'polished'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { baseFontSize } from 'src/apps/messenger/constants'

const defaultStyles = {
  fontSizes: {
    xs: rem(DEFAULT_THEME.fontSizes.xs, baseFontSize),
    sm: rem(DEFAULT_THEME.fontSizes.sm, baseFontSize),
    md: rem(DEFAULT_THEME.fontSizes.md, baseFontSize),
    sixteen: rem('16px', baseFontSize),
    lg: rem(DEFAULT_THEME.fontSizes.lg, baseFontSize),
    xl: rem(DEFAULT_THEME.fontSizes.xl, baseFontSize),
    xxl: rem(DEFAULT_THEME.fontSizes.xxl, baseFontSize),
    xxxl: rem(DEFAULT_THEME.fontSizes.xxxl, baseFontSize),
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
    xxxl: rem(DEFAULT_THEME.space.xxxl, baseFontSize),
  },
  lineHeights: {
    sm: rem(DEFAULT_THEME.lineHeights.sm, baseFontSize),
    md: rem(DEFAULT_THEME.lineHeights.md, baseFontSize),
    lg: rem(DEFAULT_THEME.lineHeights.lg, baseFontSize),
    xl: rem(DEFAULT_THEME.lineHeights.xl, baseFontSize),
    xxl: rem(DEFAULT_THEME.lineHeights.xxl, baseFontSize),
  },
}

const fullScreenBaseFontSize = 14

const fullScreenStyles = {
  fontSizes: {
    xs: rem(DEFAULT_THEME.fontSizes.xs, fullScreenBaseFontSize),
    sm: rem(DEFAULT_THEME.fontSizes.sm, fullScreenBaseFontSize),
    md: rem(DEFAULT_THEME.fontSizes.md, fullScreenBaseFontSize),
    sixteen: rem('16px', fullScreenBaseFontSize),
    lg: rem(DEFAULT_THEME.fontSizes.lg, fullScreenBaseFontSize),
    xl: rem(DEFAULT_THEME.fontSizes.xl, fullScreenBaseFontSize),
    xxl: rem(DEFAULT_THEME.fontSizes.xxl, fullScreenBaseFontSize),
    xxxl: rem(DEFAULT_THEME.fontSizes.xxxl, fullScreenBaseFontSize),
  },
  space: {
    xxxs: rem('2px', fullScreenBaseFontSize),
    xxs: rem(DEFAULT_THEME.space.xxs, fullScreenBaseFontSize),
    xs: rem(DEFAULT_THEME.space.xs, fullScreenBaseFontSize),
    sm: rem(DEFAULT_THEME.space.sm, fullScreenBaseFontSize),
    sixteen: rem('16px', fullScreenBaseFontSize),
    md: rem(DEFAULT_THEME.space.md, fullScreenBaseFontSize),
    lg: rem(DEFAULT_THEME.space.lg, fullScreenBaseFontSize),
    xl: rem(DEFAULT_THEME.space.xl, fullScreenBaseFontSize),
    xxl: rem(DEFAULT_THEME.space.xxl, fullScreenBaseFontSize),
    xxxl: rem(DEFAULT_THEME.space.xxxl, fullScreenBaseFontSize),
  },
  lineHeights: {
    sm: rem(DEFAULT_THEME.lineHeights.sm, fullScreenBaseFontSize),
    md: rem(DEFAULT_THEME.lineHeights.md, fullScreenBaseFontSize),
    lg: rem(DEFAULT_THEME.lineHeights.lg, fullScreenBaseFontSize),
    xl: rem(DEFAULT_THEME.lineHeights.xl, fullScreenBaseFontSize),
    xxl: rem(DEFAULT_THEME.lineHeights.xxl, fullScreenBaseFontSize),
  },
  iconSizes: {
    sm: rem(DEFAULT_THEME.iconSizes.sm, fullScreenBaseFontSize),
    md: rem(DEFAULT_THEME.iconSizes.md, fullScreenBaseFontSize),
    lg: rem(DEFAULT_THEME.iconSizes.lg, fullScreenBaseFontSize),
    xl: rem('32px', fullScreenBaseFontSize),
  },
}

export { defaultStyles, fullScreenStyles }

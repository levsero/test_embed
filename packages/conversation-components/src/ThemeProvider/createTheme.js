import { rem } from 'polished'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import defaultLabels from './defaultLabels'
import getReadableMessengerColor from './getReadableMessengerColor'

const createTheme = ({
  rtl = false,
  currentFrame = undefined,
  baseFontSize = '16px',
  primaryColor = DEFAULT_THEME.palette.kale[600],
  messageColor = DEFAULT_THEME.palette.kale[700],
  actionColor = DEFAULT_THEME.palette.mint[400],
  labels = {},
} = {}) => {
  return {
    ...DEFAULT_THEME,
    rtl,
    document: currentFrame?.document,
    messenger: {
      currentFrame: currentFrame,
      fontFamily: DEFAULT_THEME.fonts.system,
      baseFontSize: baseFontSize,
      colors: {
        primary: primaryColor,
        primaryText: getReadableMessengerColor(primaryColor),
        message: messageColor,
        messageText: getReadableMessengerColor(messageColor),
        action: actionColor,
        actionText: getReadableMessengerColor(actionColor),
        otherParticipantMessage: '#f4f6f8',
        otherParticipantMessageText: getReadableMessengerColor('#f4f6f8'),
        otherParticipantMessageBorder: DEFAULT_THEME.palette.grey[200],
        frameBackground: DEFAULT_THEME.palette.white,
        frameText: DEFAULT_THEME.palette.grey[800],
      },
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
      fontWeights: {
        semibold: DEFAULT_THEME.fontWeights.semibold,
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
        messageBubbleWidth: rem(52, baseFontSize),
        imageHeight: rem('146px', baseFontSize),
        imageWidth: rem('264px', baseFontSize),
      },
      lineHeights: {
        sm: rem(DEFAULT_THEME.lineHeights.sm, baseFontSize),
        md: rem(DEFAULT_THEME.lineHeights.md, baseFontSize),
        lg: rem(DEFAULT_THEME.lineHeights.lg, baseFontSize),
        xl: rem(DEFAULT_THEME.lineHeights.xl, baseFontSize),
        xxl: rem(DEFAULT_THEME.lineHeights.xxl, baseFontSize),
      },
      iconSizes: {
        sm: rem(DEFAULT_THEME.iconSizes.sm, baseFontSize),
        md: rem(DEFAULT_THEME.iconSizes.md, baseFontSize),
        lg: rem(DEFAULT_THEME.iconSizes.lg, baseFontSize),
        xl: rem('32px', baseFontSize),
        attachmentButton: '1.5rem',
      },
      borderRadii: {
        textMessage: rem('20px', baseFontSize),
        menuItem: rem('14px', baseFontSize),
        lg: rem('24px', baseFontSize),
      },
      labels: { ...defaultLabels, ...labels },
    },
  }
}

export default createTheme

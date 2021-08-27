import { rem } from 'polished'
import PropTypes from 'prop-types'
import { DEFAULT_THEME, ThemeProvider as GardenThemeProvider } from '@zendeskgarden/react-theming'
import { MESSAGE_STATUS } from 'src/constants'
import defaultLabels from './defaultLabels'
import getReadableMessengerColor from './getReadableMessengerColor'

const ThemeProvider = ({
  primaryColor = DEFAULT_THEME.palette.kale[600],
  messageColor = DEFAULT_THEME.palette.kale[700],
  actionColor = DEFAULT_THEME.palette.mint[400],
  rtl = false,
  baseFontSize = '16px',
  currentFrame = undefined,
  labels = {},
  children,
}) => {
  const combinedLabels = { ...defaultLabels, ...labels }

  const theme = {
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
        otherImageWidth: rem('264px', baseFontSize),
        primaryImageWidth: rem('284px', baseFontSize),
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
      },
      borderRadii: {
        textMessage: rem('20px', baseFontSize),
        menuItem: rem('14px', baseFontSize),
        lg: rem('24px', baseFontSize),
      },
      labels: combinedLabels,
    },
  }

  return <GardenThemeProvider theme={theme}>{children}</GardenThemeProvider>
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
  primaryColor: PropTypes.string,
  messageColor: PropTypes.string,
  actionColor: PropTypes.string,
  rtl: PropTypes.bool,
  baseFontSize: PropTypes.string,
  currentFrame: PropTypes.object,
  labels: PropTypes.shape({
    composer: PropTypes.shape({
      placeholder: PropTypes.string,
      inputAriaLabel: PropTypes.string,
      sendButtonTooltip: PropTypes.string,
      sendButtonAriaLabel: PropTypes.string,
    }),
    fileMessage: PropTypes.shape({
      sizeInMB: PropTypes.func,
      sizeInKB: PropTypes.func,
      downloadAriaLabel: PropTypes.string,
    }),
    formMessage: PropTypes.shape({
      nextStep: PropTypes.string,
      send: PropTypes.string,
      submitting: PropTypes.string,
      submissionError: PropTypes.string,
      stepStatus: PropTypes.func,
      errors: PropTypes.shape({
        requiredField: PropTypes.string,
        invalidEmail: PropTypes.string,
        fieldMinSize: PropTypes.func,
        fieldMaxSize: PropTypes.func,
      }),
    }),
    messengerHeader: PropTypes.shape({
      avatarAltTag: PropTypes.string,
      closeButtonAriaLabel: PropTypes.string,
    }),
    receipts: PropTypes.shape({
      status: PropTypes.shape({
        [MESSAGE_STATUS.sending]: PropTypes.string,
        [MESSAGE_STATUS.sent]: PropTypes.string,
        [MESSAGE_STATUS.failed]: PropTypes.string,
      }),
      receivedRecently: PropTypes.string,
    }),
  }),
  launcher: PropTypes.shape({
    ariaLabel: PropTypes.string,
  }),
}

export default ThemeProvider

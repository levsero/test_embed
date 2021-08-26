import PropTypes from 'prop-types'
import { ThemeProvider as GardenThemeProvider } from '@zendeskgarden/react-theming'
import { MESSAGE_STATUS } from 'src/constants'
import createTheme from './createTheme'

export const defaultTheme = createTheme()

const ThemeProvider = ({
  primaryColor,
  messageColor,
  actionColor,
  rtl,
  baseFontSize,
  currentFrame,
  labels,
  children,
}) => {
  const theme = createTheme({
    rtl,
    currentFrame,
    baseFontSize,
    primaryColor,
    messageColor,
    actionColor,
    labels,
  })

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

import Icon from '@zendeskgarden/svg-icons/src/16/asterisk-stroke.svg'
import ThemeProvider, { defaultTheme } from 'src/ThemeProvider'
import IconButton from '../IconButton'

export default {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    iconSize: {
      default: 'md',
      control: { type: 'select', options: Object.keys(defaultTheme.messenger.iconSizes) },
    },
    buttonSize: {
      control: { type: 'select', options: Object.keys(defaultTheme.messenger.space) },
    },
    highlightColor: {
      control: {
        type: 'select',
        value: IconButton.defaultProps.highlightColor,
        options: Object.keys(defaultTheme.messenger.colors),
      },
    },
    backgroundColor: {
      control: {
        type: 'select',
        value: IconButton.defaultProps.backgroundColor,
        options: Object.keys(defaultTheme.messenger.colors),
      },
    },
    primaryColor: {
      defaultValue: defaultTheme.palette.kale[600],
      control: { type: 'color' },
    },
    actionColor: {
      defaultValue: defaultTheme.palette.mint[400],
      control: { type: 'color' },
    },
    messageColor: {
      defaultValue: defaultTheme.palette.kale[700],
      control: { type: 'color' },
    },
  },
}

/* eslint-disable react/prop-types */
const Template = ({ primaryColor, actionColor, messageColor, ...props }) => (
  <ThemeProvider primaryColor={primaryColor} actionColor={actionColor} messageColor={messageColor}>
    <IconButton {...props}>
      <Icon />
    </IconButton>
  </ThemeProvider>
)

export const DefaultIconButton = Template.bind()
DefaultIconButton.args = {
  'aria-label': 'Call to Action',
}

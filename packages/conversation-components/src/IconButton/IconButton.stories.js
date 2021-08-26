import Icon from '@zendeskgarden/svg-icons/src/16/asterisk-stroke.svg'
import ThemeProvider, { defaultTheme } from 'src/ThemeProvider'
import IconButton from '../IconButton'

export default {
  title: 'Components/IconButton',
  component: IconButton,
  argTypes: {
    iconSize: {
      options: Object.keys(defaultTheme.messenger.iconSizes),
      control: { type: 'select' },
    },
    buttonSize: {
      options: Object.keys(defaultTheme.messenger.space),
      control: { type: 'select' },
    },
    highlightColor: {
      options: Object.keys(defaultTheme.messenger.colors),
      control: { type: 'select', value: IconButton.defaultProps.highlightColor },
    },
    backgroundColor: {
      options: Object.keys(defaultTheme.messenger.colors),
      control: { type: 'select', value: IconButton.defaultProps.backgroundColor },
    },
    primaryColor: {
      control: { type: 'color', value: defaultTheme.palette.kale[600] },
    },
    actionColor: {
      control: { type: 'color', value: defaultTheme.palette.mint[400] },
    },
    messageColor: {
      control: { type: 'color', value: defaultTheme.palette.kale[700] },
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

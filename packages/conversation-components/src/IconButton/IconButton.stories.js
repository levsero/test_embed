/* eslint no-console:0 */
// import { MessengerContainerDecorator } from '../../../.storybook/decorators'
import Icon from '@zendeskgarden/svg-icons/src/16/asterisk-stroke.svg'
import IconButton from '../IconButton'

export default {
  title: 'Components/IconButton',
  component: IconButton,
}

const Template = (args) => (
  <IconButton {...args}>
    <Icon />
  </IconButton>
)

export const DefaultIconButton = Template.bind()
DefaultIconButton.args = {
  iconSize: '',
}

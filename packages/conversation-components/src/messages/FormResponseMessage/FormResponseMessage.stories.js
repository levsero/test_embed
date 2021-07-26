import { MESSAGE_STATUS } from 'src'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator,
} from '../../../.storybook/decorators'
import FormResponseMessage from './'

export default {
  title: 'Messages/FormResponseMessage',
  component: FormResponseMessage,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator],
  argTypes: {
    status: {
      defaultValue: MESSAGE_STATUS.sent,
      control: {
        type: 'inline-radio',
        options: Object.values(MESSAGE_STATUS),
      },
    },
  },
}

const Template = (args) => <FormResponseMessage {...args} />
const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
const defaultProps = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  timeReceived: timeNowInSeconds,
}

export const TextFieldOnlyFormResponse = Template.bind()
TextFieldOnlyFormResponse.args = {
  ...defaultProps,
  fields: [
    {
      _id: 'asdf87asdf76as8d7f6ds7af876',
      label: 'Your first name',
      text: 'Cordelia',
      type: 'text',
    },
    {
      _id: 'asd87sd897s897ds8d79',
      label: 'Your last name',
      text: 'the greyhound',
      type: 'text',
    },
    {
      _id: 'asd87sd897s897ds8d89',
      label: 'email address',
      email: 'greyhounds@zendesk.com',
      type: 'email',
    },
    {
      _id: 'asd87sd897s897ds8d792',
      label: 'favourite teams',
      select: [
        { _id: 'asd87sd897s897ds8d71', label: 'taipan' },
        { _id: 'asd87sd897s897ds8d72', label: 'emu' },
      ],
      type: 'select',
    },
  ],
}

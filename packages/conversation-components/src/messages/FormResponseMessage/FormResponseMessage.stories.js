import FormResponseMessage from './'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator
} from '../../../.storybook/decorators'

export default {
  title: 'Messages/FormResponseMessage',
  component: FormResponseMessage,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator]
}

const Template = args => <FormResponseMessage {...args} />

export const TextFieldOnlyFormResponse = Template.bind()
TextFieldOnlyFormResponse.args = {
  fields: [
    {
      _id: 'asdf87asdf76as8d7f6ds7af876',
      label: 'Your first name',
      text: 'Cordelia',
      type: 'text'
    },
    {
      _id: 'asd87sd897s897ds8d79',
      label: 'Your last name',
      text: 'the greyhound',
      type: 'text'
    },
    {
      _id: 'asd87sd897s897ds8d89',
      label: 'email address',
      email: 'greyhounds@zendesk.com',
      type: 'email'
    },
    {
      _id: 'asd87sd897s897ds8d79',
      label: 'favourite teams',
      select: [
        { _id: 'asd87sd897s897ds8d70', label: 'taipan' },
        { _id: 'asd87sd897s897ds8d70', label: 'emu' }
      ],
      type: 'select'
    }
  ],
  isFirstInGroup: true,
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  label: 'I am a test user'
}

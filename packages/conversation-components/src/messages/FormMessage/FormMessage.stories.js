import FormMessage from './'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator
} from '../../../.storybook/decorators'

export default {
  title: 'Messages/FormMessage',
  component: FormMessage,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator]
}

const Template = args => <FormMessage {...args} />

export const SingleTextFieldOnly = Template.bind()
SingleTextFieldOnly.args = {
  fields: [
    {
      _id: '1',
      name: 'first_name',
      label: 'First Name',
      type: 'text'
    },
    {
      _id: '2',
      name: 'last_name',
      label: 'Last Name',
      type: 'text'
    },
    {
      _id: '3',
      name: 'meal_selection',
      label: 'Your meal?',
      type: 'select',
      selectSize: 1,
      options: [
        {
          _id: '3-1',
          name: 'pizza',
          label: 'Pizza'
        },
        {
          _id: '3-2',
          name: 'tacos',
          label: 'Tacos'
        },
        {
          _id: '3-3',
          name: 'ramen',
          label: 'Ramen'
        }
      ]
    }
  ],
  // values: {
  //   '1': 'asdf',
  //   '3': [
  //     {
  //       _id: '3-3',
  //       name: 'ramen',
  //       label: 'Ramen'
  //     }
  //   ]
  // },
  isFirstInGroup: true,
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  label: 'I am a test user',
  status: 'unsubmitted',
  activeStep: 1,
  errors: {}
}

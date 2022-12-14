/* eslint no-console:0 */
import { FORM_MESSAGE_STATUS, MESSAGE_STATUS } from 'src/constants'
import {
  MessageLogListDecorator,
  MessengerContainerDecorator,
} from '../../../.storybook/decorators'
import FormMessage from './'

export default {
  title: 'Messages/FormMessage',
  component: FormMessage,
  decorators: [MessageLogListDecorator, MessengerContainerDecorator],
  argTypes: {
    formSubmissionStatus: {
      defaultValue: FORM_MESSAGE_STATUS.unsubmitted,
      control: {
        type: 'inline-radio',
        options: Object.values(FORM_MESSAGE_STATUS),
      },
    },
    status: {
      defaultValue: MESSAGE_STATUS.sent,
      control: {
        type: 'inline-radio',
        options: Object.values(MESSAGE_STATUS),
      },
    },
  },
}

const Template = (args) => <FormMessage {...args} />
const timeNowInSeconds = Math.floor(new Date().getTime() / 1000)
const testProps = {
  label: 'Majestic Emus',
  avatar: 'https://lucashills.com/emu_avatar.jpg',
  timeReceived: timeNowInSeconds,
  onChange: (fieldId, value) => console.log('onChange(fieldId, value) fired: ', fieldId, value),
  onSubmit: (formValues) => console.log('onSubmit(formValues) fired: ', formValues),
}

export const SingleTextFieldOnly = Template.bind()
SingleTextFieldOnly.args = {
  ...testProps,
  fields: [
    {
      _id: '1',
      name: 'first_name',
      label: 'First Name',
      type: 'text',
    },
  ],
}

export const MixedFieldTypes = Template.bind()
MixedFieldTypes.args = {
  ...testProps,
  fields: [
    {
      _id: '1',
      name: 'first_name',
      label: 'First Name',
      type: 'text',
    },
    {
      _id: '2',
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
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
          label: 'Pizza',
        },
        {
          _id: '3-2',
          name: 'tacos',
          label: 'Tacos',
        },
        {
          _id: '3-3',
          name: 'ramen',
          label: 'Ramen',
        },
      ],
    },
  ],
}

export const WithPredefinedValues = Template.bind()
WithPredefinedValues.args = {
  ...testProps,
  fields: [
    {
      _id: '1',
      name: 'first_name',
      label: 'First Name',
      type: 'text',
    },
    {
      _id: '2',
      name: 'last_name',
      label: 'Last Name',
      type: 'text',
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
          label: 'Pizza',
        },
        {
          _id: '3-2',
          name: 'tacos',
          label: 'Tacos',
        },
        {
          _id: '3-3',
          name: 'ramen',
          label: 'Ramen',
        },
      ],
    },
  ],
  initialStep: 3,
  initialValues: {
    1: 'Fred likes Ramen',
    3: [
      {
        _id: '3-3',
        name: 'ramen',
        label: 'Ramen',
      },
    ],
  },
}

export const ValidationFields = Template.bind()
ValidationFields.args = {
  ...testProps,
  fields: [
    {
      _id: '1',
      name: 'min_size',
      label: 'Min size field (5)',
      minSize: 5,
      type: 'text',
    },
    {
      _id: '2',
      name: 'max_size',
      label: 'Max size field (5)',
      maxSize: 5,
      type: 'text',
    },
    {
      _id: '3',
      name: 'email_field',
      label: 'Email format',
      type: 'email',
    },
  ],
}

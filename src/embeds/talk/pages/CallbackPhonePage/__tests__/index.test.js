import { render } from '@testing-library/react'
import React from 'react'

import { Component as CallbackPhonePage } from '../'

jest.mock('src/embeds/talk/components/CallbackForm', () => () => (
  <div data-testid="talk--callback-form" />
))

test('renders the component', () => {
  const props = {
    phoneNumber: '1234567890',
    formattedPhoneNumber: '+1 2345 67890',
    phoneLabel: 'Our phone number'
  }
  const { container } = render(<CallbackPhonePage {...props} />)

  expect(container).toMatchSnapshot()
})

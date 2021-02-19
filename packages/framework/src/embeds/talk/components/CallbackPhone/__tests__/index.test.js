import { render } from '@testing-library/react'

import { Component as CallbackPhone } from '../'
import { CALLBACK_AND_PHONE } from 'src/redux/modules/talk/talk-capability-types'

jest.mock('src/embeds/talk/components/CallbackForm', () => () => (
  <div data-testid="talk--callbackForm" />
))

test('renders the component', () => {
  const props = {
    phoneNumber: '1234567890',
    formattedPhoneNumber: '+1 2345 67890',
    phoneLabel: 'Our phone number',
    capability: CALLBACK_AND_PHONE,
  }
  const { container } = render(<CallbackPhone {...props} />)

  expect(container).toMatchSnapshot()
})

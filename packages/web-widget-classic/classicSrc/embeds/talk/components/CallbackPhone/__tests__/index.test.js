import { render } from '@testing-library/react'
import { CALLBACK_AND_PHONE } from 'classicSrc/embeds/talk/talk-capability-types'
import { Component as CallbackPhone } from '../'

jest.mock('classicSrc/embeds/talk/components/CallbackForm', () => () => (
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

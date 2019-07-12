import { render } from '@testing-library/react'
import React from 'react'

import PhoneNumber from '../'

test('renders the component', () => {
  const { container } = render(
    <PhoneNumber phoneNumber={'95556666'} formattedPhoneNumber={'9-555-6666'} />
  )

  expect(container).toMatchSnapshot()
})

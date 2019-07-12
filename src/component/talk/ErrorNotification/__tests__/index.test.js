import { render } from '@testing-library/react'
import React from 'react'

import ErrorNotification from '../'

test('renders the component', () => {
  const { container } = render(<ErrorNotification message="there was an error" />)

  expect(container).toMatchSnapshot()
})

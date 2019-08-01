import { render } from '@testing-library/react'
import React from 'react'

import AverageWaitTime from '../'

test('renders the component', () => {
  const { container } = render(<AverageWaitTime message="Average wait time: 1 minute" />)

  expect(container).toMatchSnapshot()
})

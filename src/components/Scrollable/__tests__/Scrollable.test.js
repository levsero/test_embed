import React from 'react'
import { render } from '@testing-library/react'

import { Scrollable } from '../index'

it('renders provided component with the scrollable component', () => {
  const { container } = render(
    <Scrollable>
      <div>Hello</div>
    </Scrollable>
  )

  expect(container).toMatchSnapshot()
})

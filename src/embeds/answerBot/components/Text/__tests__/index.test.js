import { render } from 'src/util/testHelpers'
import React from 'react'

import Text from '../index'

test('renders the expected classes when not visitor', () => {
  const { container } = render(<Text isVisitor={false} message="not a visitor" />)

  expect(container).toMatchSnapshot()
})

test('renders the expected classes when visitor', () => {
  const { container } = render(<Text isVisitor={true} message="a visitor" />)

  expect(container).toMatchSnapshot()
})
